<!--
ChatterMate - Agent Customization View
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
-->

<script setup lang="ts">
import { ref, watch, onMounted, computed, onUnmounted, nextTick } from 'vue'
import type { AgentWithCustomization, AgentCustomization, ChatStyle } from '@/types/agent'
import { agentService } from '@/services/agent'
import WebFont from 'webfontloader'

const props = defineProps<{
    agent: AgentWithCustomization
}>()

const emit = defineEmits<{
    (e: 'cancel'): void
    (e: 'preview', customization: AgentCustomization & { showBubblePreview?: boolean }): void
    (e: 'chat-style-changed', oldStyle: ChatStyle, newStyle: ChatStyle): void
}>()

const customization = ref<AgentCustomization>({
    id: props.agent.customization?.id ?? 0,
    agent_id: props.agent.id,
    chat_background_color: props.agent.customization?.chat_background_color ?? '#F8F9FA',
    chat_bubble_color: props.agent.customization?.chat_bubble_color ?? '#E9ECEF',
    icon_color: props.agent.customization?.icon_color ?? '#6C757D',
    accent_color: props.agent.customization?.accent_color ?? '#f34611',
    font_family: props.agent.customization?.font_family ?? 'Inter, system-ui, sans-serif',
    photo_url: props.agent.customization?.photo_url,
    custom_css: props.agent.customization?.custom_css,
    customization_metadata: props.agent.customization?.customization_metadata ?? {},
    chat_style: props.agent.customization?.chat_style ?? 'CHATBOT',
    welcome_title: props.agent.customization?.welcome_title ?? '',
    welcome_subtitle: props.agent.customization?.welcome_subtitle ?? '',
})

// Chat style options with descriptions
const chatStyleOptions = [
    {
        value: 'CHATBOT' as ChatStyle,
        label: 'Chatbot',
        description: 'Traditional customer support style with agent branding',
        icon: '💬'
    },
    {
        value: 'ASK_ANYTHING' as ChatStyle,
        label: 'Ask Anything',
        description: 'Modern AI assistant style for general queries',
        icon: '🤖'
    }
]

const handleSave = async () => {
    try {
        const updatedCustomization = await agentService.updateCustomization(
            props.agent.id,
            customization.value,
        )
        
        // Update local customization with the response
        customization.value = updatedCustomization
        
        // Emit preview to update the preview panel
        emit('preview', updatedCustomization)
        
        // Show success message or handle success state
        console.log('Customization saved successfully')
    } catch (error) {
        console.error('Failed to update customization:', error)
    }
}

// Watch for changes and emit preview event
const isInternalUpdate = ref(false)

watch(customization, (newValue) => {
    if (isInternalUpdate.value) {
        return // Skip if this is an internal update to prevent loops
    }
    console.log('AgentCustomizationView - Customization changed, emitting preview:', newValue)
    emit('preview', newValue)
}, { deep: true })

// Watch for prop changes to update local customization
watch(() => props.agent.customization, (newCustomization) => {
    if (newCustomization) {
        isInternalUpdate.value = true
        customization.value = {
            id: newCustomization.id ?? 0,
            agent_id: props.agent.id,
            chat_background_color: newCustomization.chat_background_color ?? '#F8F9FA',
            chat_bubble_color: newCustomization.chat_bubble_color ?? '#E9ECEF',
            icon_color: newCustomization.icon_color ?? '#6C757D',
            accent_color: newCustomization.accent_color ?? '#f34611',
            font_family: newCustomization.font_family ?? 'Inter, system-ui, sans-serif',
            photo_url: newCustomization.photo_url,
            custom_css: newCustomization.custom_css,
            customization_metadata: newCustomization.customization_metadata ?? {},
            chat_style: newCustomization.chat_style ?? 'CHATBOT',
            welcome_title: newCustomization.welcome_title ?? '',
            welcome_subtitle: newCustomization.welcome_subtitle ?? '',
        }
        nextTick(() => {
            isInternalUpdate.value = false
        })
    }
}, { deep: true })

// Add state for Google Fonts
const googleFonts = ref<Array<{ family: string, variants: string[] }>>([])
const isLoadingFonts = ref(true)

// Watch for chat style changes specifically
const previousChatStyle = ref(customization.value.chat_style)
watch(() => customization.value.chat_style, (newStyle, oldStyle) => {
    if (newStyle !== oldStyle && !isInternalUpdate.value) {
        console.log('Chat style changed:', oldStyle, '->', newStyle)
        emit('chat-style-changed', oldStyle || 'CHATBOT', newStyle || 'CHATBOT')
        previousChatStyle.value = newStyle
    }
})

// Load Google Fonts
onMounted(async () => {
    try {
        const response = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${import.meta.env.VITE_GOOGLE_FONTS_API_KEY}&sort=popularity`)
        const data = await response.json()
        googleFonts.value = data.items
    } catch (error) {
        console.error('Failed to load Google Fonts:', error)
    } finally {
        isLoadingFonts.value = false
    }
    
    // Emit initial preview to ensure preview panel gets the customization data
    console.log('AgentCustomizationView - Emitting initial preview:', customization.value)
    emit('preview', customization.value)
})

// Update font preview when selection changes
watch(() => customization.value.font_family, (newFont) => {
    if (!newFont) return

    // Create a style element for this specific font
    const styleId = 'preview-font-style'
    let styleEl = document.getElementById(styleId)

    if (!styleEl) {
        styleEl = document.createElement('style')
        styleEl.id = styleId
        document.head.appendChild(styleEl)
    }

    // Load font but scope it to the chat panel
    WebFont.load({
        google: {
            families: [newFont]
        },
        active: () => {
            if (styleEl) {
                styleEl.textContent = `
                    .chat-panel {
                        font-family: "${newFont}", system-ui, sans-serif;
                    }
                `
            }
        }
    })
})

// Clean up the style element when component is unmounted
onUnmounted(() => {
    const styleEl = document.getElementById('preview-font-style')
    if (styleEl) {
        styleEl.remove()
    }
})

const fontSearch = ref('')
const filteredFonts = computed(() => {
    if (!fontSearch.value) return googleFonts.value
    return googleFonts.value.filter(font =>
        font.family.toLowerCase().includes(fontSearch.value.toLowerCase())
    )
})

const showFontDropdown = ref(false)

const handleFontSelect = (font: string) => {
    customization.value.font_family = font
    showFontDropdown.value = false
}


</script>

<template>
    <div class="customization-form">
        <div class="form-content">
            <!-- Widget Style Section -->
            <div class="form-section">
                <h4>Chat Style</h4>
                
                <div class="form-group">
                    <label>Style Type</label>
                    <div class="chat-style-dropdown">
                        <select 
                            v-model="customization.chat_style" 
                            class="chat-style-select"
                        >
                            <option 
                                v-for="option in chatStyleOptions" 
                                :key="option.value" 
                                :value="option.value"
                            >
                                {{ option.icon }} {{ option.label }} - {{ option.description }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Welcome Text Section (only for ASK_ANYTHING style) -->
            <div v-if="customization.chat_style === 'ASK_ANYTHING'" class="form-section">
                <h4>Welcome Message</h4>
                <p class="section-description">
                    Customize the welcome message shown when users first open the chat.
                </p>
                
                <div class="form-group">
                    <label for="welcome-title">Welcome Title</label>
                    <input 
                        id="welcome-title"
                        type="text" 
                        v-model="customization.welcome_title"
                        placeholder="e.g., Welcome to our AI Assistant"
                        class="text-input"
                        maxlength="100"
                    >
                    <small class="input-hint">
                        Leave empty to use default: "Welcome to {{ props.agent.display_name || props.agent.name }}"
                    </small>
                </div>

                <div class="form-group">
                    <label for="welcome-subtitle">Welcome Subtitle</label>
                    <textarea 
                        id="welcome-subtitle"
                        v-model="customization.welcome_subtitle"
                        placeholder="e.g., I'm here to help you with anything you need. What can I assist you with today?"
                        class="text-textarea"
                        rows="3"
                        maxlength="250"
                    ></textarea>
                    <small class="input-hint">
                        Leave empty to use default message
                    </small>
                </div>
            </div>

            <div class="form-section">
                <h4>Colors</h4>
                <div class="color-grid">

                    <div class="color-picker">
                        <label>Background</label>
                        <div class="color-input">
                            <input type="color" v-model="customization.chat_background_color">
                            <span class="color-value">{{ customization.chat_background_color }}</span>
                        </div>
                    </div>

                    <div class="color-picker">
                        <label>Chat Bubble</label>
                        <div class="color-input">
                            <input type="color" v-model="customization.chat_bubble_color"
                                @input="emit('preview', { ...customization, showBubblePreview: true })"
                                @focus="emit('preview', { ...customization, showBubblePreview: true })"
                                @blur="emit('preview', { ...customization, showBubblePreview: false })">
                            <span class="color-value">{{ customization.chat_bubble_color }}</span>
                        </div>
                    </div>

                    <div class="color-picker">
                        <label>Accent</label>
                        <div class="color-input">
                            <input type="color" v-model="customization.accent_color">
                            <span class="color-value">{{ customization.accent_color }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <h4>Typography</h4>
                <div class="form-group">
                    <label>Font Family</label>
                    <div class="font-picker">
                        <div class="font-dropdown" :class="{ 'active': showFontDropdown }">
                            <input type="text" :value="showFontDropdown ? fontSearch : customization.font_family"
                                @input="e => fontSearch = (e.target as HTMLInputElement).value"
                                placeholder="Search fonts..." class="font-search"
                                :style="!showFontDropdown ? { fontFamily: customization.font_family } : {}"
                                :disabled="isLoadingFonts" @focus="showFontDropdown = true">
                            <div v-if="showFontDropdown" class="font-options">
                                <div v-for="font in filteredFonts" :key="font.family" class="font-option"
                                    :style="{ fontFamily: font.family }" @click="handleFontSelect(font.family)">
                                    {{ font.family }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="button-group">
            <button class="cancel-button" @click="emit('cancel')">Cancel</button>
            <button class="save-button" @click="handleSave">Save Changes</button>
        </div>
    </div>
</template>

<style scoped>
.customization-form {
    padding: 0;
    max-width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.form-content {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-md);
}

.form-section {
    margin-bottom: var(--space-xl);
    padding: var(--space-md);
    background: var(--background-base);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-color);
}

.form-section h4 {
    color: var(--text-muted);
    margin-bottom: var(--space-sm);
    font-size: var(--text-sm);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.form-group {
    margin-bottom: var(--space-md);
}

.form-group label {
    display: block;
    margin-bottom: var(--space-sm);
    color: var(--text-muted);
    font-weight: 500;
    font-size: var(--text-sm);
}

.form-group input[type="file"],
.form-group select,
.form-group textarea {
    width: 100%;
    padding: var(--space-sm);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--background-soft);
}

.file-input {
    position: relative;
}

.file-input input[type="file"] {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
}

.file-label {
    display: block;
    padding: var(--space-xs) var(--space-sm);
    background: var(--background-soft);
    border: 1px dashed var(--border-color);
    border-radius: var(--radius-md);
    cursor: pointer;
    text-align: center;
    color: var(--text-muted);
    font-size: var(--text-sm);
}

.color-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-sm);
}

.color-picker {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
}

.color-input {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    background: var(--background-soft);
    padding: var(--space-xs);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
}

.color-input input[type="color"] {
    width: 32px;
    height: 32px;
    padding: 0;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
}

.color-value {
    font-family: monospace;
    color: var(--text-muted);
    font-size: var(--text-xs);
}

.button-group {
    display: flex;
    gap: var(--space-sm);
    padding: var(--space-lg) var(--space-md);
    border-top: 1px solid var(--border-color);
    background: var(--background-base);
    margin-top: auto;
    flex-shrink: 0;
}

.save-button,
.cancel-button {
    padding: var(--space-sm) var(--space-lg);
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    font-weight: 500;
    flex: 1;
    min-width: 120px;
    transition: var(--transition-fast);
}

.save-button {
    background: var(--primary-color);
    color: white;
}

.save-button:hover {
    background: var(--primary-dark);
}

.cancel-button {
    background: var(--background-soft);
    color: var(--text-color);
}

.cancel-button:hover {
    background: var(--background-mute);
}

.font-picker {
    position: relative;
}

.font-dropdown {
    position: relative;
}

.font-search {
    width: 100%;
    padding: var(--space-sm);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--background-soft);
    color: var(--text-color);
    font-size: var(--text-sm);
}

.font-options {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    max-height: 200px;
    overflow-y: auto;
    background: white;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    margin-top: var(--space-xs);
    z-index: 10;
    box-shadow: var(--shadow-lg);
}

.font-option {
    padding: var(--space-sm);
    cursor: pointer;
    transition: var(--transition-fast);
}

.font-option:hover {
    background: var(--background-soft);
}

.color-picker label {
    font-size: var(--text-sm);
    margin-bottom: var(--space-xs);
}

/* Chat style dropdown styles */
.chat-style-dropdown {
    position: relative;
}

.chat-style-select {
    width: 100%;
    padding: var(--space-sm);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--background-soft);
    color: var(--text-color);
    font-size: var(--text-sm);
    cursor: pointer;
    transition: var(--transition-fast);
}

.chat-style-select:hover {
    border-color: var(--border-color-hover);
    background: var(--background-mute);
}

.chat-style-select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 1px var(--primary-color);
}

/* Welcome text customization styles */
.section-description {
    color: var(--text-muted);
    font-size: var(--text-sm);
    margin-bottom: var(--space-md);
    line-height: 1.5;
}

.text-input,
.text-textarea {
    width: 100%;
    padding: var(--space-sm) var(--space-md);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--background-soft);
    color: var(--text-color);
    font-size: var(--text-sm);
    font-family: inherit;
    transition: var(--transition-fast);
    resize: vertical;
}

.text-input:focus,
.text-textarea:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 1px var(--primary-color);
    background: var(--background-base);
}

.text-input::placeholder,
.text-textarea::placeholder {
    color: var(--text-muted);
    opacity: 0.7;
}

.input-hint {
    display: block;
    margin-top: var(--space-xs);
    color: var(--text-muted);
    font-size: var(--text-xs);
    line-height: 1.4;
}

.text-textarea {
    min-height: 80px;
    line-height: 1.5;
}
</style>
