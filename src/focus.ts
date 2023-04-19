export function focus(node) {
    const toggle = node.querySelector('button')

    function focusHandler() {
        toggle.focus()
    }

    node.addEventListener('click', focus)

    return {
        destroy() {
            node.removeEventListener('click', focus)
        }
    }
}

