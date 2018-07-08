/////
// EDAMAM API SEARCH WITH KEYWORD
/////
var Edamam = {
    URL: "https://api.edamam.com/search?",
    app_id: '3ff2cec1',
    app_key: '5daaa38e313d46e5ddf1d70317e69608',
    searchNum: 1,
    searchFrom: 0, //!!! temporarily setting it up for 100.  it should be the count - 1.
    searchedItems: [],
    randItems: [],
    $RandCtnr: "",
    $RandomFood: "",
    callback: null,
    setCallback: function(callback) {
        this.callback = callback;
    },
    // buildQueryURLSearch: function(keyword, diet, health, calories, excluded) {
    buildQueryURLSearch: function(keyword) {
        var queryURL = this.URL + "app_id=" + this.app_id + "&app_key=" + this.app_key + "&";
        var queryParams = {};
        queryParams.q = keyword;
        // queryParams.diet = diet || "";
        // queryParams.health = health || "";
        // queryParams.calories = calories || "";
        // queryParams.excluded = excluded || "";
        this.searchFrom = Math.floor(Math.random() * 100);
        queryParams.from = this.searchFrom; 
        queryParams.to = queryParams.from + this.searchNum;
        queryURL += $.param(queryParams);
        return queryURL;
    },
    
    callAjax: function(keyword) {
        $.ajax({
            url: this.buildQueryURLSearch(keyword),
            method: "GET"
        }).then( function(response) {
            Edamam.getData(response);
            // this.callback();     //!!! displaySearchedItems runs before callAjax.  Trying to run callback on Ajax.
            console.log(Edamam.searchedItems);
            console.log(Edamam.searchedItems[0]);
        });
    },

    // PUSHING THIS ITEM INFO TO edamam.searchedItems[]
    getData: function (Data) {    
        var newItem = {};
        newItem.label = Data.hits[0].recipe.label;
        newItem.image = Data.hits[0].recipe.image;
        newItem.dietLabels = Data.hits[0].recipe.dietLabels;
        newItem.calories = Data.hits[0].recipe.calories;
        newItem.ingredients = Data.hits[0].recipe.ingredients;
        this.searchedItems.unshift(newItem);
    }
};

$(document).on("click", '.food-img', function (event){
    event.preventDefault();
    console.log(this);
    console.log($(this).attr("name"));
    var foodItem = $(this).attr("name");
    var proxyURL = 'https://shielded-hamlet-43668.herokuapp.com/'
    var queryURL = "https://api.yelp.com/v3/businesses/search?term=" + foodItem + "&latitude=37.786882&longitude=-122.399972";
    $.ajax({
        url: proxyURL + queryURL,
        method: "GET",
        "headers": {
            "authorization": "Bearer aXBYOEZ2urYrK_dgFfaCQyg96ftnMSPopRdFnFxEMu7ndPT-WYFcQ4CFuBjlmpHmLxrPC8cpKlHrVN5mrySh8FnXsTI-VPIBrI9tVD6qN0qGtM0n_K1ZncYU0R89W3Yx",
        }
    }).then( function(response) {
        // $(".result-item-pic").attr("src", response.businesses[0].image_url);
        console.log(response);
        console.log(response.businesses[0]);
        $(".result-item-pic").attr("src", response.businesses[0].image_url);
        $("#res-name").text(response.businesses[0].name);
        $("#recipie-name").text(foodItem);
        $("#stars").text(response.businesses[0].rating);
        $(".food-price").text("Price Range : " + response.businesses[0].price);
        $(".phone").text(response.businesses[0].display_phone);
        $(".address").text(response.businesses[0].location.address1 + ", " + response.businesses[0].location.city + ", "
                           + response.businesses[0].location.state  + "-" +  response.businesses[0].location.zip_code);
        $(".yelp-link").attr("href", response.businesses[0].url);

        console.log("test");
        /* Generate map and add it onto the 'Map' id */
        var myLatlng = new google.maps.LatLng(40.7282, -74.0776);
        var mapOptions = {
            zoom: 16,
            center: myLatlng
        }
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        var marker = new google.maps.Marker({
            position: myLatlng,
            title: response.businesses[0].name
        });

        // To add the marker to the map, call setMap();
        marker.setMap(map);
    });
})



