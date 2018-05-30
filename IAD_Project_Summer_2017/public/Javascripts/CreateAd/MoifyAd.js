function openPage(evt, Ads) {
    var i, modifyaddcontent, tablets
    modifyaddcontent = document.getElementsByClassName("Modifycontent");
    for (i = 0; i < modifyaddcontent.length; i++) {
        modifyaddcontent[i].style.display = "none";
    }
    tablets = document.getElementsByClassName("tablets");
    for (i = 0; i < tablets.length; i++) {
        tablets[i].className = tablets[i].className.replace("active", "");
    }
    document.getElementById(Ads).style.display = "block";
    evt.currentTarget.className += "active";
}