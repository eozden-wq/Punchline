document.querySelector('#get_jk').addEventListener('click', () => {
    fetch('/cancer_status').then(res => res.json()).then(body => {
        document.querySelector('#canc_stat').innerHTML = "You have stage " + body["stage"] + " cancer"
    });
});