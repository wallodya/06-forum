export const toggleLabel = (_input, _label) => {
    _input.current.value
        ? _label.current.style.opacity = '1'
        : _label.current.style.opacity = '0'
}

export const labelStyles = {
    marginBottom: "-1rem",
    opacity: "0",
}