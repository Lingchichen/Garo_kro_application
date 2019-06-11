//https://stackoverflow.com/a/27037567
function findAncestor (el, sel) {
    while ((el = el.parentElement) && !((el.matches || el.matchesSelector).call(el,sel)));
    return el;
}


function ready(fn) {
    if (
        document.attachEvent
          ? document.readyState === "complete"
          : document.readyState !== "loading"
    ) fn();
    else document.addEventListener('DOMContentLoaded', fn);
}

ready(function(){
    var companySelector = document.getElementById('sidebar-company-select')
    if(companySelector){
        companySelector.addEventListener('change', function(e){
            //substitute the company id and remove everything after the top-level model name
            window.location.pathname = window.location.pathname.replace(
                /clients\/\d+\//g,
                'clients/'+e.target.value+'/'
            ).replace(/(?<=clients\/\d+\/[^/]*\/).*/g, '');
        });
    }

    //Bulk Delete on List Components
    document.querySelectorAll('.list-component .delete-button').forEach(function(el){
        el.addEventListener('click', function(e){
            component = findAncestor(el, '.list-component');
            form = component.querySelector('form');
            if(form.querySelectorAll('input[type=checkbox]:checked').length > 0) form.submit();
        });
    });
});
