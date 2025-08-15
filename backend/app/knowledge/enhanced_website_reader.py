"""
ChatterMate - Enhanced Website Reader
Copyright (C) 2024 ChatterMate

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>
"""

import random
import re
import time
from datetime import datetime
from dataclasses import dataclass, field
from typing import Dict, List, Set, Tuple, Optional, Callable
from urllib.parse import urljoin, urlparse
import concurrent.futures
from concurrent.futures import ThreadPoolExecutor, as_completed

from bs4 import BeautifulSoup, Tag
import httpx

from agno.document.base import Document
from agno.document.reader.website_reader import WebsiteReader
from app.core.logger import get_logger

# Initialize logger for this module
logger = get_logger(__name__)


@dataclass
class EnhancedWebsiteReader(WebsiteReader):
    """Enhanced Reader for Websites with more robust content extraction"""
    debug_on = True
    # Additional configuration options
    min_content_length: int = 100  # Minimum length of text to be considered meaningful content
    blacklist_tags: List[str] = field(default_factory=lambda: [
        'script', 'style', 'nav', 'footer', 'header', 'aside', 'noscript', 'iframe', 'head'
    ])
    common_content_tags: List[str] = field(default_factory=lambda: [
        'article', 'main', 'section', 'div', 'p', 'content', 'body'
    ])
    common_content_classes: List[str] = field(default_factory=lambda: [
        'content', 'main-content', 'post-content', 'article-content', 'entry-content', 'page-content',
        'blog-content', 'main', 'article', 'post', 'entry', 'text', 'body', 'container'
    ])
    common_content_ids: List[str] = field(default_factory=lambda: [
        'content', 'main-content', 'post-content', 'article-content', 'entry-content', 'page-content',
        'blog-content', 'main', 'article', 'post', 'entry', 'text', 'body', 'container'
    ])
    user_agent: str = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
    headers: Dict[str, str] = field(default_factory=lambda: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'max-age=0'
    })
    timeout: int = 30  # Request timeout in seconds
    max_retries: int = 3  # Maximum number of retries for failed requests
    respect_robots_txt: bool = True  # Whether to respect robots.txt
    max_workers: int = 10  # Maximum number of parallel workers for crawling
    
    # Track crawling statistics
    _crawled_pages_count: int = 0
    _successful_crawls: int = 0
    _failed_crawls: int = 0
    
    def _get_primary_domain(self, url: str) -> str:
        """
        Extract primary domain from the given URL.
        Overrides the parent method to handle domains more effectively.

        :param url: The URL to extract the primary domain from.
        :return: The primary domain.
        """
        # Parse the URL to get the netloc
        parsed_url = urlparse(url)
        netloc = parsed_url.netloc
        
        # Strip 'www.' prefix if present
        if netloc.startswith('www.'):
            netloc = netloc[4:]
        
        # Get the relevant domain part (last two components for common domains)
        parts = netloc.split('.')
        
        # Special case for country code TLDs with subdomains (e.g., co.uk, com.au)
        if len(parts) > 2 and parts[-2] in ['co', 'com', 'org', 'net', 'edu', 'gov', 'ac'] and len(parts[-1]) == 2:
            domain = '.'.join(parts[-3:])  # Include subdomains like example.co.uk
        else:
            domain = '.'.join(parts[-2:] if len(parts) > 1 else parts)  # domain.com or just domain
        

        return domain
    
    def _extract_main_content(self, soup: BeautifulSoup) -> str:
        """
        Extracts the main content from a BeautifulSoup object using multiple strategies.
        
        Strategies:
        1. Look for main content containers (article, main, etc.)
        2. Look for content by class names
        3. Look for content by ID
        4. Density-based content extraction (paragraph density)
        5. Fallback to cleaned body content
        
        :param soup: The BeautifulSoup object to extract the main content from.
        :return: The main content as a string.
        """
        # Remove undesirable elements first
        self._clean_soup(soup)
        
        # Strategy 1: Try to find main content by common content tags
        for tag in self.common_content_tags:
            elements = soup.find_all(tag)
            for element in elements:
                content = self._get_clean_text(element)
                if len(content) >= self.min_content_length:
                    return content
                    
        # Strategy 2: Try to find main content by common class names
        for class_name in self.common_content_classes:
            elements = soup.find_all(class_=re.compile(class_name, re.IGNORECASE))
            for element in elements:
                content = self._get_clean_text(element)
                if len(content) >= self.min_content_length:
                    return content
        
        # Strategy 3: Try to find main content by common IDs
        for id_name in self.common_content_ids:
            element = soup.find(id=re.compile(id_name, re.IGNORECASE))
            if element:
                content = self._get_clean_text(element)
                if len(content) >= self.min_content_length:
                    return content
        
        # Strategy 4: Density-based content extraction
        density_content = self._extract_by_text_density(soup)
        if density_content and len(density_content) >= self.min_content_length:
            return density_content
            
        # Strategy 5: Fallback to entire body content with minimal cleaning
        body = soup.find('body')
        if body:
            return self._get_clean_text(body)
            
        # Last resort: just get all text from the document
        return soup.get_text(strip=True, separator=" ")
        
    def _clean_soup(self, soup: BeautifulSoup) -> None:
        """
        Removes undesirable elements from the soup.
        
        :param soup: The BeautifulSoup object to clean.
        """
        # Remove comments
        for comment in soup.find_all(string=lambda text: isinstance(text, str) and text.strip().startswith('<!--')):
            comment.extract()
            
        # Remove blacklisted tags
        for tag in self.blacklist_tags:
            for element in soup.find_all(tag):
                element.extract()
                
        # Remove hidden elements with style attribute
        for element in soup.find_all(style=re.compile(r'display:\s*none|visibility:\s*hidden')):
            element.extract()
            
        # Remove elements with hidden class
        for element in soup.find_all(class_='hidden'):
            element.extract()
            
        # Remove elements with certain classes
        for class_name in ['ads', 'advertisement', 'banner', 'cookie', 'popup', 'modal', 'sidebar']:
            for element in soup.find_all(class_=re.compile(class_name, re.IGNORECASE)):
                element.extract()

    def _get_clean_text(self, element: Tag) -> str:
        """
        Gets clean text from a BeautifulSoup element.
        
        :param element: The BeautifulSoup element to get text from.
        :return: The clean text.
        """
        if not element:
            return ""
            
        # Get text with preserved whitespace
        text = element.get_text(separator=" ", strip=True)
        
        # Normalize whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove excessive newlines
        text = re.sub(r'\n{2,}', '\n', text)
        
        return text.strip()
        
    def _extract_by_text_density(self, soup: BeautifulSoup) -> str:
        """
        Extracts content based on text density (paragraphs with substantial text).
        
        :param soup: The BeautifulSoup object to extract content from.
        :return: The extracted content.
        """
        paragraphs = soup.find_all('p')
        if not paragraphs:
            return ""
            
        # Find paragraphs with substantial text
        good_paragraphs = []
        for p in paragraphs:
            text = p.get_text(strip=True)
            # Consider paragraphs with more than 20 characters
            if len(text) > 20:
                good_paragraphs.append(p)
                
        if not good_paragraphs:
            return ""
            
        # Find the most common parent that contains a good number of paragraphs
        parent_counts = {}
        for p in good_paragraphs:
            for parent in p.parents:
                if parent.name not in ['html', 'body']:
                    parent_counts[parent] = parent_counts.get(parent, 0) + 1
                    
        # Get the parent with the most children
        if parent_counts:
            best_parent = max(parent_counts.items(), key=lambda x: x[1])[0]
            return self._get_clean_text(best_parent)
            
        # If no good parent found, just concatenate the good paragraphs
        return " ".join([self._get_clean_text(p) for p in good_paragraphs])

    def _process_url(self, url_info: Tuple[str, int], primary_domain: str) -> Optional[Tuple[str, str, List[str]]]:
        """
        Process a single URL - fetch content and extract links.
        This is used for parallel processing of URLs.
        
        :param url_info: Tuple of (URL, depth)
        :param primary_domain: Primary domain to filter links
        :return: Tuple of (URL, content, new_links) or None if failed
        """
        current_url, current_depth = url_info
        
        # Skip if URL meets any skip conditions
        if current_url in self._visited:
            return None
            
        if not urlparse(current_url).netloc.endswith(primary_domain):
            return None
            
        if current_depth > self.max_depth:
            return None
        
        # Mark as visited before processing
        self._visited.add(current_url)
        
        self.delay()
        
        # Increment crawled pages counter
        self._crawled_pages_count += 1
        page_start_time = time.time()
        logger.info(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Crawling page {self._crawled_pages_count}: {current_url} (depth: {current_depth})")

        # Try to get content from URL with retries
        content = None
        new_links = []
        retry_count = 0
        last_error = None
        
        while retry_count < self.max_retries and content is None:
            try:
                # Make the request
                with httpx.Client(
                    timeout=self.timeout, 
                    follow_redirects=True, 
                    headers=self.headers
                ) as client:
                    response = client.get(current_url)
                    response.raise_for_status()
                    
                # Parse HTML with BeautifulSoup
                soup = BeautifulSoup(response.text, 'html.parser')
                content = self._extract_main_content(soup)
                
                # Check content quality
                if not content or len(content) < self.min_content_length:
                    self._failed_crawls += 1
                    return None
                
                self._successful_crawls += 1
                logger.info(f"✓ Successfully extracted {len(content)} chars from {current_url}")
                
                # Extract new links if not at max depth
                if current_depth < self.max_depth:
                    links = self._extract_links(soup, current_url)
                    
                    next_depth = current_depth + 1
                    new_links = [(link, next_depth) for link in links 
                                if link not in self._visited]
                    
            except Exception as e:
                retry_count += 1
                last_error = str(e)
                # Exponential backoff
                if retry_count < self.max_retries:
                    time.sleep(2 ** retry_count)
        
        # Log failure if all retries failed
        if content is None:
            self._failed_crawls += 1
            return None
        
        page_end_time = time.time()
        page_duration = page_end_time - page_start_time
        logger.info(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Completed crawling page {self._crawled_pages_count} (Time taken: {page_duration:.2f}s)")
        
        return (current_url, content, new_links)

    def crawl(self, url: str, starting_depth: int = 1, on_document_callback: Optional[Callable[[str, str], None]] = None, on_url_crawled_callback: Optional[Callable[[str], None]] = None) -> Dict[str, str]:
        """
        Enhanced crawl method with parallel processing and immediate vector DB insertion.
        
        :param url: The URL to crawl.
        :param starting_depth: The starting depth level for the crawl.
        :param on_document_callback: Callback function that receives (url, content) for immediate processing
        :param on_url_crawled_callback: Callback function that receives (url) when a page is successfully crawled
        :return: Dictionary of URLs and their corresponding content.
        """
        # Reset visited and urls_to_crawl for fresh crawl
        self._visited = set()
        self._urls_to_crawl = []
        
        # Reset crawling statistics
        self._crawled_pages_count = 0
        self._successful_crawls = 0
        self._failed_crawls = 0
        
        crawl_start_time = time.time()
        logger.info(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Starting parallel crawl of {url} with max_depth={self.max_depth}, max_links={self.max_links}, and max_workers={self.max_workers}")
        
        crawler_result: Dict[str, str] = {}
        primary_domain = self._get_primary_domain(url)
        
        # Add starting URL with its depth to the queue
        urls_to_process = [(url, starting_depth)]
        logger.info(f"Added starting URL to crawl queue: {url} (depth: {starting_depth})")
        
        # Use ThreadPoolExecutor for parallel processing
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            # Process URLs in batches until no more URLs or max_links reached
            while urls_to_process and len(crawler_result) < self.max_links:
                # Take a batch of URLs to process
                batch_size = min(self.max_workers, len(urls_to_process))
                current_batch = urls_to_process[:batch_size]
                urls_to_process = urls_to_process[batch_size:]
                

                
                # Submit all URLs in the current batch for parallel processing
                future_to_url = {
                    executor.submit(self._process_url, url_info, primary_domain): url_info[0]
                    for url_info in current_batch
                }
                
                # Process completed futures as they finish
                for future in as_completed(future_to_url):
                    url = future_to_url[future]
                    try:
                        result = future.result()
                        if result:
                            processed_url, content, new_links = result
                            
                            # Add the content to our results
                            crawler_result[processed_url] = content
                            
                            # Call the URL crawled callback first (for progress tracking)
                            if on_url_crawled_callback:
                                logger.debug(f"📞 Calling URL crawled callback for: {processed_url}")
                                on_url_crawled_callback(processed_url)
                            
                            # Call the callback for immediate processing if provided
                            if on_document_callback:
                                on_document_callback(processed_url, content)
                            
                            # Add new links to the processing queue
                            for new_link, depth in new_links:
                                if new_link not in self._visited and (new_link, depth) not in urls_to_process:
                                    urls_to_process.append((new_link, depth))
                            
                            # If we've reached max_links, break early
                            if len(crawler_result) >= self.max_links:
                                logger.info(f"Reached maximum number of links ({self.max_links}), stopping further crawling")
                                break
                                
                    except Exception as exc:
                        logger.error(f"URL {url} generated an exception: {exc}")
                        self._failed_crawls += 1

        # Log crawling summary
        crawl_end_time = time.time()
        crawl_duration = crawl_end_time - crawl_start_time
        logger.info(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Parallel crawl completed: {len(crawler_result)} pages crawled successfully")
        logger.info(f"Crawling statistics: Total: {self._crawled_pages_count}, Successful: {self._successful_crawls}, Failed: {self._failed_crawls}")
        logger.info(f"Total crawling time: {crawl_duration:.2f}s, Average time per page: {crawl_duration/max(1, self._crawled_pages_count):.2f}s")
        
        return crawler_result

    def _extract_links(self, soup: BeautifulSoup, base_url: str) -> List[str]:
        """
        Extract links from a BeautifulSoup object.
        
        :param soup: The BeautifulSoup object.
        :param base_url: The base URL to resolve relative URLs.
        :return: A list of absolute URLs.
        """
        links = []
        primary_domain = self._get_primary_domain(base_url)
        
        all_links = soup.find_all("a", href=True)
        
        for link in all_links:
            if not isinstance(link, Tag):
                continue
            
            href_str = str(link["href"])
            full_url = urljoin(base_url, href_str)
            
            if not isinstance(full_url, str):
                continue
                
            # Filter out unwanted URLs
            parsed_url = urlparse(full_url)
            
            # Ignore self-links
            if full_url == base_url:
                continue
                
            # Check if it's in the same domain
            link_domain = parsed_url.netloc
            is_same_domain = link_domain.endswith(primary_domain)
            
            if (
                is_same_domain
                and not any(parsed_url.path.endswith(ext) for ext in [
                    ".pdf", ".jpg", ".png", ".gif", ".zip", ".mp3", ".mp4", ".exe", ".dll"
                ])
                and not parsed_url.path.startswith("#")  # Skip anchors
                and "?" not in full_url  # Skip query parameters for simplicity
            ):
                links.append(full_url)
                
        logger.info(f"Extracted {len(links)} valid links from {base_url}")
        return links

    def _create_document_from_content(self, page_url: str, content: str, source_url: str, index: int) -> Document:
        """
        Create a Document object from page content with proper metadata.
        
        :param page_url: The URL of the page
        :param content: The page content
        :param source_url: Original source URL 
        :param index: The document index
        :return: Document object
        """
        # Extract page identifier without protocol and domain for ID
        parsed_url = urlparse(page_url)
        path = parsed_url.path
        
        # Handle fragment identifiers (#section)
        fragment = parsed_url.fragment
        if fragment:
            path = f"{path}#{fragment}"
        
        # Clean up path for ID generation
        if not path or path == "/":
            path = "index"
        else:
            # Remove leading/trailing slashes and replace special chars
            path = path.strip("/")
            path = re.sub(r'[^\w\-]', '_', path)
        
        # Create metadata with relevant information
        metadata = {
            "url": page_url,
            "chunk": index,
            "chunk_size": len(content)
        }
        
        # Create document with content and metadata
        document = Document(
            content=content,
            meta_data=metadata
        )
        
        # Set document ID and name
        document.id = page_url
        # Set name to full page URL for matching with knowledge_queue
        document.name = source_url
        

        
        return document

    def read(self, url: str, vector_db_callback: Optional[Callable[[Document], None]] = None, url_crawled_callback: Optional[Callable[[str], None]] = None) -> List[Document]:
        """
        Read content from a URL, crawl related pages, and convert the content into Documents.
        Optionally sends documents to vector DB as they are created.
        
        :param url: The URL to read from.
        :param vector_db_callback: Optional callback to send documents to vector DB as they're created
        :param url_crawled_callback: Optional callback called when each URL is successfully crawled
        :return: A list of Document objects.
        """
        # Get timestamp for tracking
        start_time = time.time()
        logger.info(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Starting to read from {url} with parallel processing")
        
        documents = []
        
        # Create a callback for immediate document processing
        def on_document_created(page_url: str, content: str):
            index = len(documents) + 1
            document = self._create_document_from_content(page_url, content, url, index)
            documents.append(document)
            
            # Call vector DB callback if provided
            if vector_db_callback:
                try:
                    vector_db_callback(document)
                    logger.info(f"✓ Document {document.id} successfully sent to vector DB")
                except Exception as e:
                    logger.error(f"Error sending document {document.id} to vector DB: {str(e)}")
        
        # Crawl website with the callback for immediate document processing
        self.crawl(url, on_document_callback=on_document_created, on_url_crawled_callback=url_crawled_callback)
        
        end_time = time.time()
        duration = end_time - start_time
        logger.info(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Completed reading from {url} - Created {len(documents)} documents (Total time: {duration:.2f}s)")
        
        return documents 