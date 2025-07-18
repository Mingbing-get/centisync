import render from './app'

const root = document.createElement('div')
root.style = 'position: fixed; top: 50%; right: 0; transform: translate(0, -50%)'

document.body.appendChild(root)

render(root)
