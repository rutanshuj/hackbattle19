window.onload = function(){
    $('#submit').click(function () {
        $('.divFilter').fadeIn();
        showResults();
    });

    setTimeout(function(){
        $('.gif').fadeOut('fast');
    }, 100);

    $('#myModal').modal('show');
    let card = document.getElementById('searchCard');
    card.style.visibility = 'visible';
    $(card).hide();
    setTimeout(function(){
        $(card).show(50);
    }, 100);

    //JS for Filter

    let reset = 0;
    let filterLocation;
    let filterPrice;
    let filterSqft;
    let filterBedroom;
    let minP = 0;
    let maxP = 1;
    let valMap = [0, 1000, 2000, 3000, 4000, 5000];

    let filterJSON = {
        location: null,
        priceMin: null,
        priceMax: null,
        sqft: null,
        bedroom: null
    };

    $('#sidebarCollapse').on('click', function(){
        $('#sidebar').toggleClass('active');
        $(this).toggleClass('active');
    });

    $('.nav-link').on('click',function(){
        $('.nav-link').removeClass('active');
        $(this).addClass('active');
    });

    $('#btnReset').click(function(){
        $('#location').text("Location").removeClass('selectedItem');
        $('#price').text("Price").removeClass('selectedItem');
        $('#sqft').text("sqft").removeClass('selectedItem');
        $('#bedroom').text("Bedrooms").removeClass('selectedItem');

        $('#listLocation li div').removeClass('active');
        $('#listSqft li div').removeClass('active');
        $('#listBedroom li div').removeClass('active');
        minP = 0;
        maxP = 1;

        for(var key in filterJSON){
            filterJSON[key] = "";
        }
        showOriginalList();
        reset = 1;
    });



    //Clicking Original List Item
    $('#listOriginal li div').click(function(){
        let id = $(this).attr('id');
        reset = 0;
        $('#listOriginal').fadeOut(10);
        switch(id){
            case "location":
                $('#listLocation').fadeIn(100);
                $('#listLocation li div').click(function(){
                    $(this).addClass('active');
                    $('#listLocation li div').not(this).removeClass('active');
                    filterLocation = $(this).text();
                    filterJSON.location = filterLocation;
                    $('#location').text(filterLocation).addClass('selectedItem');
                    showOriginalList();
                });
                break;
            case "price":
                $('#listPrice').fadeIn(100);
                let sliderRange = $('#slider-range');
                sliderRange.slider({
                    range: true,
                    min: 0,
                    max: valMap.length - 1,
                    values: [ minP, maxP ],
                    slide: function( event, ui ) {
                        $( "#amount" ).val( "$" + valMap[ui.values[ 0 ]] + " - $" + valMap[ui.values[ 1 ]] );
                        minP = ui.values[0];
                        maxP = ui.values[1];
                    }
                });
                $( "#amount" ).val( "$" + valMap[sliderRange.slider( "values", 0 )] + " - $" + valMap[sliderRange.slider( "values", 1 )] );

                $('#btnDonePrice').click(function(){
                    let min = valMap[sliderRange.slider("values", 0)];
                    let max = valMap[sliderRange.slider("values", 1)];

                    filterJSON.priceMin = min;
                    filterJSON.priceMax = max;

                    filterPrice = $("#amount").val();
                    $('#price').text(filterPrice).addClass('selectedItem');
                    showOriginalList();
                });
                break;
            case "sqft":
                let listSqft = $('#listSqft');
                let divSqft = $('#listSqft li div');
                listSqft.fadeIn(100);
                divSqft.click(function(){
                    $(this).addClass('active');
                    divSqft.not(this).removeClass('active');
                    filterSqft = $(this).text();
                    filterJSON.sqft = filterSqft;

                    $('#sqft').text(filterSqft).addClass('selectedItem');
                    showOriginalList();
                });
                break;
            case "bedroom":
                let listBedroom = $('#listBedroom');
                let divBedroom = $('#listBedroom li div');
                listBedroom.fadeIn(100);
                divBedroom.click(function(){
                    $(this).addClass('active');
                    divBedroom.not(this).removeClass('active');
                    filterBedroom = $(this).text();
                    filterJSON.bedroom =  $(this).attr('id');

                    $('#bedroom').text(filterBedroom).addClass('selectedItem');
                    showOriginalList();
                });
                break;
        }
    });

    $('#btnBack').click(function(){
        showOriginalList();
    });

    $('#btnUpdate').click(function(){
        $.ajax({
            type: 'POST',
            url: '/filterItem',
            data: JSON.stringify(filterJSON),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(data){
                console.log(data);
                let source = document.getElementById('result-template').innerHTML;
                let template = Handlebars.compile(source);
                let html = template(data);
                $('.wrapperSidebar').css('display','flex');
                $("#sr").html(html);
            }
        });
    });

};

function showOriginalList(){
    $('#listOriginal').fadeIn(100);

    //Hide Other Lists
    $('#listLocation').fadeOut(10);
    $('#listPrice').fadeOut(10);
    $('#listSqft').fadeOut(10);
    $('#listBedroom').fadeOut(10);
}

function showResults(){
    let bmin = document.getElementById('bhkInput').value;
    let pf = document.getElementById('priceMin').value;
    let pt = document.getElementById('priceMax').value;
    $.ajax({
        type: 'GET',
        data: {
            bmin: bmin,
            pf: pf,
            pt: pt
        },
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        url: "/results",
        success: function(data){
            let source = document.getElementById('result-template').innerHTML;
            let template = Handlebars.compile(source);
            let html = template(data);
            $('.wrapperSidebar').css('display','flex');
            $("#sr").html(html);
        }
    });

    let cardDiv = document.getElementById('cardDiv');
    let image = document.getElementById('landingBanner');
    let indexNavbar = document.getElementById('indexNavbar');

    $(image).animate({
        marginTop: "-100%",
    }, 300);
    setTimeout(function(){
        indexNavbar.style.backgroundImage = "url('/images/landingBannerMin.png')";
        $(image).hide();
    }, 200);
    $(cardDiv).hide(200);

    let sideBar = document.getElementsByClassName("wrapperSidebar")[0];
    let header = document.getElementsByTagName("nav")[0];
    sideBar.style.marginTop = window.getComputedStyle(header).getPropertyValue("height");
    console.log(sideBar.style.marginTop);
}