"""
ChatterMate - Shopify Toolkit
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

from typing import Optional, Dict, Any, List
from agno.tools import Toolkit
from app.core.logger import get_logger
from app.services.shopify import ShopifyService
from app.repositories.session_to_agent import SessionToAgentRepository
from app.database import SessionLocal
from app.models.organization import Organization
from app.models.agent import Agent
from app.models.shopify import AgentShopifyConfig, ShopifyShop
from app.repositories.shopify_shop_repository import ShopifyShopRepository
from app.repositories.agent_shopify_config_repository import AgentShopifyConfigRepository
from uuid import UUID
import json
import traceback
from app.core.config import settings

logger = get_logger(__name__)

class ShopifyTools(Toolkit):
    def __init__(self, agent_id: str, org_id: str, session_id: str):
        super().__init__(name="shopify_tools")
        self.agent_id = agent_id
        self.org_id = org_id
        self.session_id = session_id
        
        # Register the functions
        self.register(self.list_products)
        self.register(self.get_product)
        self.register(self.search_products)
        self.register(self.search_orders)
        self.register(self.get_order_status)
        self.register(self.recommend_products)
    
    def _get_shop_for_agent(self) -> Optional[ShopifyShop]:
        """
        Helper method to get the Shopify shop associated with the agent.
        
        Returns:
            ShopifyShop: The shop associated with the agent, or None if not found or not enabled.
        """
        try:
            logger.debug(f"Getting shop for agent {self.agent_id}")
            
            with SessionLocal() as db:
                # Get the agent's Shopify configuration
                agent_shopify_config_repo = AgentShopifyConfigRepository(db)
                shopify_config = agent_shopify_config_repo.get_agent_shopify_config(str(self.agent_id))
                
                if not shopify_config or not shopify_config.enabled or not shopify_config.shop_id:
                    logger.warning("Shopify integration is not enabled for this agent")
                    return None
                    
                # Get the shop
                shopify_repo = ShopifyShopRepository(db)
                shop = shopify_repo.get_shop(shopify_config.shop_id)
                
                if not shop or not shop.is_installed:
                    logger.warning("Shopify shop not found or not installed")
                    return None
                    
                # Verify the shop belongs to the current organization
                org_uuid = UUID(str(self.org_id))
                if str(shop.organization_id) != str(org_uuid):
                    logger.warning(f"Shop {shop.id} does not belong to organization {self.org_id}")
                    return None
                    
                return shop
            
        except Exception as e:
            logger.error(f"Error getting shop for agent: {str(e)}")
            return None
    
    def list_products(self, limit: int = 10) -> str:
        """
        List products from the Shopify store.
        
        Args:
            limit: Maximum number of products to return (default: 10)
            
        Returns:
            str: JSON string with the list of products or error information
        """
        try:
            # Get the Shopify shop for this agent
            shop = self._get_shop_for_agent()
            
            if not shop:
                return json.dumps({
                    "success": False,
                    "message": "Shopify integration is not enabled for this agent or shop not found"
                })
                
            # List products using context manager for database operations
            with SessionLocal() as db:
                shopify_service = ShopifyService(db)
                result = shopify_service.get_products(shop, limit)
                return json.dumps(result)
            
        except Exception as e:
            logger.error(f"Error listing products: {str(e)}")
            return json.dumps({
                "success": False,
                "message": f"Error listing products: {str(e)}"
            })
    
    def get_product(self, product_id: str) -> str:
        """
        Get a specific product from the Shopify store.
        
        Args:
            product_id: The ID of the product to retrieve
            
        Returns:
            str: JSON string with the product details or error information
        """
        try:
            # Get the Shopify shop for this agent
            shop = self._get_shop_for_agent()
            
            if not shop:
                return json.dumps({
                    "success": False,
                    "message": "Shopify integration is not enabled for this agent or shop not found"
                })
                
            # Get the product using context manager for database operations
            with SessionLocal() as db:
                shopify_service = ShopifyService(db)
                result = shopify_service.get_product(shop, product_id)
            
            # Check if product was found
            if result.get("success", False) and result.get("product"):
                # Format as a product card
                return json.dumps({
                    "success": True,
                    "message": f"Here is the product information for {result.get('product', {}).get('title')}",
                    "shopify_product": result.get("product")
                })
            else:
                # Product not found or error
                return json.dumps(result)
            
        except Exception as e:
            logger.error(f"Error getting product: {str(e)}")
            return json.dumps({
                "success": False,
                "message": f"Error getting product: {str(e)}"
            })
    
    def search_products(self, query: str, limit: int = 5, cursor: Optional[str] = None) -> str:
        """
        Search for products in the Shopify store using a query string with GraphQL.
        Supports Shopify's search syntax including field specifiers (e.g., 'title:snowboard', 'tag:beginner', 'product_type:skate'),
        operators ('AND', 'OR'), and suffix wildcards ('skate*'). Supports pagination using a cursor.
        
        Args:
            query: The search query string using Shopify syntax.
            limit: Maximum number of products to return (default: 5)
            cursor: The pagination cursor (endCursor from previous pageInfo) to fetch the next page.
            
        Returns:
            str: JSON string. If products are found, includes 'shopify_output' with the list of products,
                 'search_query', 'total_count', and 'pageInfo'. If no products are found, returns a success message.
                 On error, returns an error message.
        """
        try:
            # Get the Shopify shop for this agent
            shop = self._get_shop_for_agent()
            
            if not shop:
                return json.dumps({
                    "success": False,
                    "message": "Shopify integration is not enabled for this agent or shop not found"
                })
            
            # Use GraphQL to search products with pagination
            graphql_query = """
            query SearchProducts($searchTerm: String!, $limit: Int!, $cursor: String) {
              products(first: $limit, query: $searchTerm, after: $cursor) {
                edges {
                  node {
                    id
                    title
                    description
                    handle
                    productType
                    vendor
                    totalInventory
                    priceRangeV2 {
                      minVariantPrice {
                        amount
                        currencyCode
                      }
                      maxVariantPrice {
                        amount
                        currencyCode
                      }
                    }
                    images(first: 1) {
                      edges {
                        node {
                          id
                          url
                          altText
                        }
                      }
                    }
                    tags
                    createdAt
                    updatedAt
                  }
                }
                pageInfo {
                  hasNextPage
                  endCursor
                }
              }
            }
            """
            
            variables = {
                "searchTerm": query,
                "limit": limit,
                "cursor": cursor # Add cursor to variables
            }
            
            # Execute the GraphQL query
            url = f"https://{shop.shop_domain}/admin/api/2025-07/graphql.json"
            headers = {
                "X-Shopify-Access-Token": shop.access_token,
                "Content-Type": "application/json"
            }
            
            payload = {
                "query": graphql_query,
                "variables": variables
            }
            
            import requests
            verify_ssl = settings.VERIFY_SSL_CERTIFICATES
            response = requests.post(url, headers=headers, json=payload, verify=verify_ssl)
            
            if response.status_code != 200:
                logger.error(f"Failed to search products: {response.text}")
                return json.dumps({
                    "success": False,
                    "message": f"Failed to search products: {response.text}"
                })
            
            result = response.json()
            
            # Check for GraphQL errors
            if "errors" in result:
                logger.error(f"GraphQL errors: {result['errors']}")
                return json.dumps({
                    "success": False,
                    "message": f"GraphQL errors: {result['errors']}"
                })
            
            # Transform the GraphQL data structure
            products_data = result.get("data", {}).get("products", {})
            edges = products_data.get("edges", [])
            page_info = products_data.get("pageInfo", {})
            
            # Extract products from edges
            products = []
            for edge in edges:
                node = edge.get("node", {})
                
                # Extract the first image URL if available
                image_url = None
                images = node.get("images", {}).get("edges", [])
                if images and len(images) > 0:
                    image_url = images[0].get("node", {}).get("url")
                
                # Extract price information
                price_range = node.get("priceRangeV2", {})
                min_price = price_range.get("minVariantPrice", {}).get("amount")
                max_price = price_range.get("maxVariantPrice", {}).get("amount")
                currency_code = price_range.get("minVariantPrice", {}).get("currencyCode")
                
                # Transform to product structure
                transformed_product = {
                    "id": node.get("id").split("/")[-1] if node.get("id") else None,
                    "title": node.get("title"),
                    "description": node.get("description"),
                    "handle": node.get("handle"),
                    "product_type": node.get("productType"),
                    "vendor": node.get("vendor"),
                    "total_inventory": node.get("totalInventory"),
                    "price": min_price,
                    "price_max": max_price,
                    "currency": currency_code,
                    "image": {"src": image_url} if image_url else None,
                    "tags": node.get("tags"),
                    "created_at": node.get("createdAt"),
                    "updated_at": node.get("updatedAt")
                }
                
                products.append(transformed_product)
            
            # Check if search was successful
            if products:
                # Create a response with the full list of products structured for the frontend
                return json.dumps({
                    "success": True,
                    "message": f"Found {len(products)} product(s) matching your search.",
                    "shopify_output": { # Nest products under shopify_output
                         "products": products,
                         "search_query": query,
                         "total_count": len(products), 
                         "pageInfo": page_info # Include full pageInfo
                    }
                })
            else:
                # No products found
                return json.dumps({
                    "success": True,
                    "message": f"No products found matching '{query}'. Try a different search term."
                    # Keep shopify_output or make it null/empty based on frontend handling
                    # "shopify_output": {"products": [], "search_query": query}
                })
            
        except Exception as e:
            logger.error(f"Error searching products: {str(e)}")
            logger.error(traceback.format_exc())
            return json.dumps({
                "success": False,
                "message": f"Error searching products: {str(e)}"
            })
    
   
    def search_orders(self, query: str = None, customer_email: str = None, order_number: str = None, limit: int = 10) -> str:
        """
        Search for orders in the Shopify store using GraphQL API.
        
        Args:
            query: General search query for orders
            customer_email: Customer's email address to filter orders
            order_number: Specific order number to search for
            limit: Maximum number of orders to return (default: 10)
            
        Returns:
            str: JSON string with the matching orders or error information
        """
        try:
            # Get the Shopify shop for this agent
            shop = self._get_shop_for_agent()
            
            if not shop:
                return json.dumps({
                    "success": False,
                    "message": "Shopify integration is not enabled for this agent or shop not found"
                })

            # Construct the search query
            search_terms = []
            if query:
                search_terms.append(query)
            if customer_email:
                search_terms.append(f"email:{customer_email}")
            if order_number:
                search_terms.append(f"name:{order_number}")

            # Join search terms with AND operator
            search_query = " AND ".join(search_terms) if search_terms else ""

            # GraphQL query for orders with correct field names (updated based on Shopify's schema)
            graphql_query = """
            query SearchOrders($query: String, $first: Int!) {
              orders(first: $first, query: $query, sortKey: CREATED_AT, reverse: true) {
                edges {
                  node {
                    id
                    name
                    email
                    phone
                    createdAt
                    displayFinancialStatus
                    displayFulfillmentStatus
                    subtotalLineItemsQuantity
                    currentSubtotalPriceSet {
                      shopMoney {
                        amount
                        currencyCode
                      }
                    }
                    currentTotalPriceSet {
                      shopMoney {
                        amount
                        currencyCode
                      }
                    }
                    originalTotalPriceSet {
                      shopMoney {
                        amount
                        currencyCode
                      }
                    }
                    customer {
                      id
                      firstName
                      lastName
                      email
                    }
                    lineItems(first: 5) {
                      edges {
                        node {
                          title
                          quantity
                          originalUnitPriceSet {
                            shopMoney {
                              amount
                              currencyCode
                            }
                          }
                          variant {
                            id
                            title
                            image {
                              url
                            }
                          }
                        }
                      }
                    }
                    shippingAddress {
                      address1
                      address2
                      city
                      provinceCode
                      zip
                      country
                    }
                    fulfillments {
                      trackingInfo {
                        company
                        number
                        url
                      }
                      status
                    }
                  }
                }
                pageInfo {
                  hasNextPage
                  endCursor
                }
              }
            }
            """

            # Execute the GraphQL query
            url = f"https://{shop.shop_domain}/admin/api/2025-07/graphql.json"
            headers = {
                "X-Shopify-Access-Token": shop.access_token,
                "Content-Type": "application/json"
            }
            
            variables = {
                "query": search_query,
                "first": limit
            }
            
            payload = {
                "query": graphql_query,
                "variables": variables
            }
            
            import requests
            verify_ssl = settings.VERIFY_SSL_CERTIFICATES
            response = requests.post(url, headers=headers, json=payload, verify=verify_ssl)
            
            if response.status_code != 200:
                logger.error(f"Failed to search orders: {response.text}")
                return json.dumps({
                    "success": False,
                    "message": f"Failed to search orders: {response.text}"
                })
            
            result = response.json()
            
            # Check for GraphQL errors
            if "errors" in result:
                logger.error(f"GraphQL errors: {result['errors']}")
                return json.dumps({
                    "success": False,
                    "message": f"GraphQL errors: {result['errors']}"
                })
            
            # Transform the GraphQL data structure
            orders_data = result.get("data", {}).get("orders", {})
            edges = orders_data.get("edges", [])
            page_info = orders_data.get("pageInfo", {})
            
            # Extract orders from edges
            orders = []
            for edge in edges:
                node = edge.get("node", {})
                
                # Transform line items
                line_items = []
                for item_edge in node.get("lineItems", {}).get("edges", []):
                    item_node = item_edge.get("node", {})
                    variant = item_node.get("variant")
                    original_unit_price_set = item_node.get("originalUnitPriceSet", {}).get("shopMoney", {})
                    
                    # Parse price which is now nested
                    try:
                        price_amount = float(original_unit_price_set.get("amount")) if original_unit_price_set.get("amount") is not None else None
                    except (ValueError, TypeError):
                        price_amount = None
                    
                    # Handle case where variant might be None
                    variant_title = None
                    image_url = None
                    if variant:
                        variant_title = variant.get("title")
                        image_data = variant.get("image")
                        if image_data:
                            image_url = image_data.get("url")

                    line_items.append({
                        "title": item_node.get("title"),
                        "quantity": item_node.get("quantity"),
                        "price": price_amount,
                        "variant_title": variant_title,
                        "image_url": image_url
                    })
                
                # Get price information - access via Set and shopMoney
                current_total_set = node.get("currentTotalPriceSet", {}).get("shopMoney", {})
                original_total_set = node.get("originalTotalPriceSet", {}).get("shopMoney", {})
                subtotal_set = node.get("currentSubtotalPriceSet", {}).get("shopMoney", {})
                
                # Process tracking information from fulfillments
                tracking_info = []
                for fulfillment in node.get("fulfillments", []):
                    for tracking in fulfillment.get("trackingInfo", []):
                        tracking_info.append({
                            "company": tracking.get("company"),
                            "number": tracking.get("number"),
                            "url": tracking.get("url")
                        })
                
                # Transform order data
                order = {
                    "id": node.get("id").split("/")[-1] if node.get("id") else None,
                    "name": node.get("name"),
                    "email": node.get("email"),
                    "phone": node.get("phone"),
                    "created_at": node.get("createdAt"),
                    "financial_status": node.get("displayFinancialStatus"),
                    "fulfillment_status": node.get("displayFulfillmentStatus"),
                    "total_items": node.get("subtotalLineItemsQuantity"),
                    "current_total": current_total_set.get("amount"),
                    "original_total": original_total_set.get("amount"),
                    "subtotal": subtotal_set.get("amount"),
                    "currency": current_total_set.get("currencyCode"),
                    "customer": {
                        "id": node.get("customer", {}).get("id"),
                        "first_name": node.get("customer", {}).get("firstName"),
                        "last_name": node.get("customer", {}).get("lastName"),
                        "email": node.get("customer", {}).get("email")
                    },
                    "line_items": line_items,
                    "shipping_address": node.get("shippingAddress"),
                    "tracking_info": tracking_info
                }
                
                orders.append(order)
            
            # Return success response with orders and pagination info
            return json.dumps({
                "success": True,
                "message": f"Found {len(orders)} order(s)",
                "orders": orders,
                "page_info": page_info
            })
            
        except Exception as e:
            logger.error(f"Error searching orders: {str(e)}")
            logger.error(traceback.format_exc())
            return json.dumps({
                "success": False,
                "message": f"Error searching orders: {str(e)}"
            })
    
    def get_order_status(self, order_id: str) -> str:
        """
        Get the status of a specific order from the Shopify store.
        
        Args:
            order_id: The ID of the order to retrieve status for
            
        Returns:
            str: JSON string with order status details or error information
        """
        try:
            # Get the Shopify shop for this agent
            shop = self._get_shop_for_agent()
            
            if not shop:
                return json.dumps({
                    "success": False,
                    "message": "Shopify integration is not enabled for this agent or shop not found"
                })
                
            # Get order details using context manager for database operations
            with SessionLocal() as db:
                shopify_service = ShopifyService(db)
                result = shopify_service.get_order(shop, order_id)
            
            # If successful, extract relevant order status information
            if result.get("success", False) and result.get("order"):
                order = result.get("order")
                status_info = {
                    "success": True,
                    "order_id": order.get("id"),
                    "order_number": order.get("name"),
                    "status": order.get("financial_status"),
                    "fulfillment_status": order.get("fulfillment_status"),
                    "created_at": order.get("created_at"),
                    "processed_at": order.get("processed_at"),
                    "customer": order.get("customer"),
                    "total_price": order.get("total_price"),
                    "currency": order.get("currency"),
                    "fulfillments": order.get("fulfillments", []),
                    "shipping_address": order.get("shipping_address"),
                    "billing_address": order.get("billing_address"),
                    "tracking_numbers": []
                }
                
                # Extract tracking numbers from fulfillments
                fulfillments = order.get("fulfillments", [])
                tracking_numbers = []
                for fulfillment in fulfillments:
                    if fulfillment.get("tracking_number"):
                        tracking_numbers.append(fulfillment.get("tracking_number"))
                    elif fulfillment.get("tracking_numbers"):
                        tracking_numbers.extend(fulfillment.get("tracking_numbers"))
                
                status_info["tracking_numbers"] = tracking_numbers
                
                return json.dumps(status_info)
            
            return json.dumps(result)
            
        except Exception as e:
            logger.error(f"Error getting order status: {str(e)}")
            return json.dumps({
                "success": False,
                "message": f"Error getting order status: {str(e)}"
            })
    
    def recommend_products(self, product_id: Optional[str] = None, product_type: Optional[str] = None, tags: Optional[str] = None, limit: int = 3, cursor: Optional[str] = None) -> str:
        """
        Recommend products based on similarity to a reference product ID, product type, or tags.
        Constructs a Shopify search query based on the provided criteria using GraphQL. Supports pagination.
        
        Use this when a user asks for recommendations (e.g., "suggest something similar", "show me beginner skateboards").
        Translate the user's request into relevant product_type or tags if possible.
        
        Args:
            product_id: ID of a reference product. Recommendations will be based on this product's type and tags.
            product_type: Product type to base recommendations on (e.g., 'skateboard', 'snowboard').
            tags: Comma-separated list of tags to base recommendations on (e.g., 'beginner,skate', 'winter,accessory').
            limit: Maximum number of recommendations to return (default: 3).
            cursor: The pagination cursor (endCursor from previous pageInfo) to fetch the next page.
            
        Returns:
            str: JSON string. If recommendations are found, includes 'shopify_output' with the list of products,
                 'search_type', 'total_count', and 'pageInfo'. If none found, returns a relevant message.
                 On error, returns an error message.
        """
        try:
            shop = self._get_shop_for_agent()
            if not shop:
                return json.dumps({"success": False, "message": "Shopify integration is not enabled for this agent or shop not found"})

            search_query_parts = []
            search_limit = limit
            
            if product_id:
                # Fetch reference product to get its type and tags using GraphQL
                ref_product = None
                
                # Use GraphQL to get product details
                graphql_query = """
                query GetProduct($id: ID!) {
                  product(id: $id) {
                    id
                    title
                    productType
                    tags
                  }
                }
                """
                
                gid = f"gid://shopify/Product/{product_id}"
                variables = {
                    "id": gid
                }
                
                url = f"https://{shop.shop_domain}/admin/api/2025-07/graphql.json"
                headers = {
                    "X-Shopify-Access-Token": shop.access_token,
                    "Content-Type": "application/json"
                }
                
                payload = {
                    "query": graphql_query,
                    "variables": variables
                }
                
                import requests
                verify_ssl = settings.VERIFY_SSL_CERTIFICATES
                response = requests.post(url, headers=headers, json=payload, verify=verify_ssl)
                
                if response.status_code == 200:
                    result = response.json()
                    if "data" in result and "product" in result["data"] and result["data"]["product"]:
                        ref_product = result["data"]["product"]
                
                if ref_product:
                    ref_type = ref_product.get("productType")
                    ref_tags = ref_product.get("tags", [])
                    
                    if ref_type:
                        search_query_parts.append(f"product_type:'{ref_type}'")
                        
                    if ref_tags:
                        # Handle tags as a list
                        if isinstance(ref_tags, list):
                            for tag in ref_tags[:3]:  # Use up to 3 tags for recommendations
                                search_query_parts.append(f"tag:'{tag}'")
                        elif isinstance(ref_tags, str):
                            tags_list = [tag.strip() for tag in ref_tags.split(',') if tag.strip()]
                            for tag in tags_list[:3]:
                                search_query_parts.append(f"tag:'{tag}'")
                    
                    # Exclude the reference product itself
                    search_query_parts.append(f"-id:{product_id}")
                    search_limit = limit + 1
                else:
                    logger.warning(f"Could not fetch reference product ID: {product_id} for recommendations.")
            
            # Add criteria from direct arguments if no product_id or if fallback needed
            if not product_id or not search_query_parts:
                if product_type:
                    search_query_parts.append(f"product_type:'{product_type}'")
                if tags:
                    tag_list = [tag.strip() for tag in tags.split(',') if tag.strip()]
                    for tag in tag_list[:3]:
                        search_query_parts.append(f"tag:'{tag}'")

            # Determine search type and query
            if not search_query_parts:
                # Fallback: Get recent products if no criteria specified
                logger.info("No specific criteria for recommendations, fetching recent products.")
                
                # Use GraphQL to get recent products with pagination
                graphql_query = """
                query GetProducts($limit: Int!, $cursor: String) {
                  products(first: $limit, sortKey: CREATED_AT, reverse: true, after: $cursor) {
                    edges {
                      node {
                        id
                        title
                        description
                        handle
                        productType
                        vendor
                        totalInventory
                        priceRangeV2 {
                          minVariantPrice {
                            amount
                            currencyCode
                          }
                          maxVariantPrice {
                            amount
                            currencyCode
                          }
                        }
                        images(first: 1) {
                          edges {
                            node {
                              id
                              url
                              altText
                            }
                          }
                        }
                        tags
                        createdAt
                        updatedAt
                      }
                    }
                    pageInfo {
                      hasNextPage
                      endCursor
                    }
                  }
                }
                """
                
                variables = {
                    "limit": limit,
                    "cursor": cursor
                }
                
                search_type = "recent products"
            else:
                # Construct final query: Join parts with OR for broader recommendations
                search_query = " OR ".join(search_query_parts)
                logger.info(f"Constructed recommendation search query: {search_query}")
                
                # Use GraphQL to search products with pagination
                graphql_query = """
                query SearchProducts($searchTerm: String!, $limit: Int!, $cursor: String) {
                  products(first: $limit, query: $searchTerm, after: $cursor) {
                    edges {
                      node {
                        id
                        title
                        description
                        handle
                        productType
                        vendor
                        totalInventory
                        priceRangeV2 {
                          minVariantPrice {
                            amount
                            currencyCode
                          }
                          maxVariantPrice {
                            amount
                            currencyCode
                          }
                        }
                        images(first: 1) {
                          edges {
                            node {
                              id
                              url
                              altText
                            }
                          }
                        }
                        tags
                        createdAt
                        updatedAt
                      }
                    }
                    pageInfo {
                      hasNextPage
                      endCursor
                    }
                  }
                }
                """
                
                variables = {
                    "searchTerm": search_query,
                    "limit": search_limit,
                    "cursor": cursor
                }
                
                search_type = "recommendations"
            
            # Execute the GraphQL query
            url = f"https://{shop.shop_domain}/admin/api/2025-07/graphql.json"
            headers = {
                "X-Shopify-Access-Token": shop.access_token,
                "Content-Type": "application/json"
            }
            
            payload = {
                "query": graphql_query,
                "variables": variables
            }
            
            import requests
            verify_ssl = settings.VERIFY_SSL_CERTIFICATES
            response = requests.post(url, headers=headers, json=payload, verify=verify_ssl)
            
            if response.status_code != 200:
                logger.error(f"Failed to get recommendations: {response.text}")
                return json.dumps({
                    "success": False,
                    "message": f"Failed to get recommendations: {response.text}"
                })
            
            result = response.json()
            
            # Check for GraphQL errors
            if "errors" in result:
                logger.error(f"GraphQL errors: {result['errors']}")
                return json.dumps({
                    "success": False,
                    "message": f"GraphQL errors: {result['errors']}"
                })
            
            # Transform the GraphQL data structure
            products_data = result.get("data", {}).get("products", {})
            edges = products_data.get("edges", [])
            page_info = products_data.get("pageInfo", {})
            
            # Extract products from edges
            products = []
            for edge in edges:
                node = edge.get("node", {})
                
                # Extract the first image URL if available
                image_url = None
                images = node.get("images", {}).get("edges", [])
                if images and len(images) > 0:
                    image_url = images[0].get("node", {}).get("url")
                
                # Extract price information
                price_range = node.get("priceRangeV2", {})
                min_price = price_range.get("minVariantPrice", {}).get("amount")
                max_price = price_range.get("maxVariantPrice", {}).get("amount")
                currency_code = price_range.get("minVariantPrice", {}).get("currencyCode")
                
                # Transform to product structure
                transformed_product = {
                    "id": node.get("id").split("/")[-1] if node.get("id") else None,
                    "title": node.get("title"),
                    "description": node.get("description"),
                    "handle": node.get("handle"),
                    "product_type": node.get("productType"),
                    "vendor": node.get("vendor"),
                    "total_inventory": node.get("totalInventory"),
                    "price": min_price,
                    "price_max": max_price,
                    "currency": currency_code,
                    "image": {"src": image_url} if image_url else None,
                    "tags": node.get("tags"),
                    "created_at": node.get("createdAt"),
                    "updated_at": node.get("updatedAt")
                }
                
                products.append(transformed_product)
            
            # Filter out the original product_id if it was part of the criteria and fetch limit allowed
            if product_id and search_limit > limit:
                original_gid = f"gid://shopify/Product/{product_id}"
                products = [p for p in products if p.get("id") != original_gid and p.get("id") != product_id][:limit]

            # Process results
            if products:
                recommendation_message = f"Here are {len(products)} recommendations for you:"
                # Customize message based on initial criteria if needed
                if product_type and not product_id: recommendation_message = f"Here are recommendations in the {product_type} category:"
                elif tags and not product_id: recommendation_message = f"Here are products tagged with {tags}:"
                elif product_id: recommendation_message = f"Based on the product you viewed, you might like:"
                
                return json.dumps({
                    "success": True,
                    "message": recommendation_message,
                    "shopify_output": { # Nest products under shopify_output
                        "products": products,
                        "search_type": search_type, # Optional context
                        "total_count": len(products),
                        "pageInfo": page_info # Include full pageInfo
                    }
                })

            # No products found or initial search failed
            no_results_message = "Sorry, I couldn't find any product recommendations matching the criteria."
            # Customize message based on input
            if product_type: no_results_message = f"Sorry, I couldn't find recommendations in the {product_type} category."
            elif tags: no_results_message = f"Sorry, I couldn't find recommendations matching the tags: {tags}."
            elif product_id: no_results_message = "Sorry, I couldn't find similar products based on the reference product."
            
            return json.dumps({
                "success": True,
                "message": no_results_message
                # Keep shopify_output or make it null/empty based on frontend handling
                # "shopify_output": {"products": [], "search_type": search_type}
            })

        except Exception as e:
            logger.error(f"Error recommending products: {str(e)}")
            logger.error(traceback.format_exc())
            return json.dumps({
                "success": False,
                "message": f"An error occurred while generating recommendations: {str(e)}"
            }) 