this.showMenuLevel1 = ( event ) =>{
    $('.MainFlyout__level1').addClass('show-section');
}

this.showMenuLevel2 = ( event, lvId, urlImg ) =>{
    $('.lv2').removeClass('show-section');
    let w = $('.MainFlyout__level3').width();
    if(event.classList.contains('has-child-ag')){
        // $('.MainFlyout__level2').show(300);
        $('.MainFlyout__level2').addClass('show-section');
        $('.' + lvId).addClass('show-section');

        showMenuLevel4(true, urlImg);

        //juego con el desplazamiento del div de la imagen
        $('.MainFlyout__levelImg').css('right', w);
    }
    else{
        $('.MainFlyout__level2').removeClass('show-section');
        $('.MainFlyout__level3').removeClass('show-section');
        showMenuLevel4(true, urlImg);

        //juego con el desplazamiento del div de la imagen
        $('.MainFlyout__levelImg').css('right', w+w);
    }
    
}

this.showMenuLevel3 = ( event, lvId ) =>{
    $('.lv3').removeClass('show-section');
    let w = $('.MainFlyout__level3').width();
    if(event.classList.contains('has-child-ag')){
        // $('.MainFlyout__level2').show(300);
        $('.MainFlyout__level3').addClass('show-section');
        $('.' + lvId).addClass('show-section');

        //juego con el desplazamiento del div de la imagen
        $('.MainFlyout__levelImg').css('right', 0);
    }
    else{
        $('.MainFlyout__level3').removeClass('show-section');

        //juego con el desplazamiento del div de la imagen
        $('.MainFlyout__levelImg').css('right', w);
    }
    
}

this.showMenuLevel4 = ( show, urlImg ) =>{
    show ? $('.MainFlyout__levelImg').addClass('show-section').attr('style', urlImg) 
         : $('.MainFlyout__levelImg').removeClass('show-section');    
}

this.resizeHeightMenu = () =>{
    // Se calcula el div más grande
    // let levels = $('.MainFlyout__wrapper--border');
    // for (let l of levels) {
    //     console.log($(l).height());
    // }

    // Parametrizar el valor del height 575
    $('.MainFlyout__level1').css('height', 600);
}

$( document ).ready(function() {
    //Cuando se pierde el foco del menu
    $( "html" ).click( (e) => {
        if(!e.target.className.includes('MainFlyout')){
            $('.section-ag').removeClass('show-section');
        }
    });

    //Ajusta el height del menú en general
    resizeHeightMenu();
});

