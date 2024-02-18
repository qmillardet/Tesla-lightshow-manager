const { contextBridge, ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency])
    }
})

contextBridge.exposeInMainWorld('device', {
    info: () => ipcRenderer.invoke('device-info'),
    eject: (device) => ipcRenderer.invoke('device-eject', device)
    //Nous pouvons exposer des variables en plus des fonctions
})
contextBridge.exposeInMainWorld('lightshow', {
    list: (partitionName) => ipcRenderer.invoke('lightshow-list', partitionName),
    copy: async (device, mountPoint, lightshow) => ipcRenderer.invoke('lightshow-copy', device, mountPoint, lightshow),
    remove: async (device, mountPoint, lightshow) => ipcRenderer.invoke('lightshow-remove', device, mountPoint, lightshow)
    //Nous pouvons exposer des variables en plus des fonctions
})
