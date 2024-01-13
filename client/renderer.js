const func = async () => {
    const response = await window.versions.deviceInfo()
    response.forEach((element) => {
        let body = document.getElementById('deviceNameBody');
        body.innerHTML += '<tr><td> ' + element.device  + '</td></tr>'
    })
}

func()