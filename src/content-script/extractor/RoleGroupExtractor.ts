import { applyAriaOptions, applyUUIDToElementAndContext, extractAriaOptions, Roles } from "../utils/common"
import { extractContextFromAriaInput } from "./input"

export type GroupType = 'radio' | 'checkbox' | 'option'

export function getGroupType(group: Element): GroupType | null {
    if (!group) {
        return null
    }

    const radio = group.querySelector(Roles.RADIO)
    const checkbox = group.querySelector(Roles.CHECKBOX)
    const option = group.querySelector(Roles.OPTION)
    const truthyCount = [radio, checkbox, option].filter(Boolean).length;

    if(truthyCount !== 1) return null

    if (radio) return 'radio'
    if (checkbox) return 'checkbox'
    if (option) return 'option'
    return null
}

export function isRoleGroupNode(node: Element): boolean {
    if (!node) {
        return false
    }

    const groupRoles = [
        'group',
        'listbox',
        'list',
        'radiogroup'
    ]

    const role = node.getAttribute('role')
    return role ? groupRoles.includes(role) : false
}

export function extractAllGroupContext(node: Document | HTMLElement) {
    const selectors = [
        '[role="group"]',
        '[role="listbox"]',
        '[role="list"]',
        '[role="radiogroup"]'
    ]

    const groups = node.querySelectorAll(selectors.join(', '))

    const contexts = []

    for (const group of Array.from(groups)) {
        const context = extractGroupContext(group as HTMLElement)
        if (!context) continue
        
        applyUUIDToElementAndContext(group as HTMLElement, context)
        contexts.push(context)
    }
    return contexts
}

export function applyGroupNodeAnswer(e: Element, options: string[]) {
    const groupType = getGroupType(e)

    if (!groupType) return 

    e.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'center'
    });

    let role = Roles.OPTION;
    switch(groupType) {
        case 'checkbox':
            role = Roles.CHECKBOX;
            break;
        default:
            role = Roles.RADIO;
            break;
    }

    applyAriaOptions(e, role, options)
}

export function extractGroupContext(group: HTMLElement) {
    let optionSelector = null
    const groupType = getGroupType(group)

    if (groupType === 'radio') {
        optionSelector = Roles.RADIO
    }

    if (groupType === 'checkbox') {
        optionSelector = Roles.CHECKBOX
    }

    if (!optionSelector || !groupType) {
        return null
    }

    const options = extractAriaOptions(group, optionSelector)
    const context = extractContextFromAriaInput(group)
    context.tagName = groupType?.toLowerCase()
    return {
        ...context,
        options
    }
}

