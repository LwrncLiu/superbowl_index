function showInfoDiv() {
    console.log('clicked')
    var x = document.getElementById("infoContent");
    x.style.display = "block"
}

function hideInfoDiv() {
    console.log('closing')
    var x = document.getElementById("infoContent")
    x.style.display = "none"
}

document.getElementById('closeIcon').addEventListener("click", hideInfoDiv)
document.getElementById('infoIcon').addEventListener("click", showInfoDiv)
