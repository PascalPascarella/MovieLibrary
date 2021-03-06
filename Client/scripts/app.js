getMoviesList();

// function myPopup() {
//     document.getElementById("popup").classList.toggle("show")
// }

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");     // Add :active modifier to button while dropdown is visible
}
  
  // Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
         if (document.getElementsByClassName("dropdown-content").classList.contains('show')) {
           document.getElementById("dropdown-content").classList.remove('show');
         }
      }
    }
  
//Grabs database entries with GET and pass the data to LayoutMovies
function getMoviesList(){
        $.ajax({
            type: "GET",
            url: "https://localhost:44325/api/movie/",
            dataType:'json',
            success: function( data, textStatus, jQxhr ){
                LayoutMovies(data);
                console.log( "Get Done without error" );
            },
            error: function( jqXhr, textStatus, errorThrown ){
                console.log( errorThrown );
            }
        }).done(function(){ console.log( "Get Done" );
    });
    document.getElementById("movieListHeading").textContent = "-- Browse our movies! --"; 
} 
//Search database with GET for any part of a word.
function searchMovies(search, event){
    
    $.ajax({
        type: "GET",
        url: "https://localhost:44325/api/movie/search/"+search,
        dataType:'json',
        success: function( data, textStatus, jQxhr ){
            LayoutMovies(data);
            console.log( "search without error" );
        },
        error: function( jqXhr, textStatus, errorThrown ){
            console.log( errorThrown );
        }
    }).done(function(){ console.log( "search Done" );
});
   event.preventDefault(); 
   //LayoutMovies(data);
   document.getElementById("search").value = '';
   document.getElementById("movieListHeading").textContent = "-- Clear search. --";
} 
//Grabs one movie by ID with GET
function loadMovieForm(id){
    $.ajax({
        type: "GET",
        url: "https://localhost:44325/api/movie/" + id,
            dataType:'json',
            success: function( data, textStatus, jQxhr ){
                editMovieForm(data);
                // processEditForm();
                //LayoutMovies(data);
                console.log( "grab for edit without error" );
                // LayoutMovies(data);
                console.log(id);
            },
            error: function( jqXhr, textStatus, errorThrown ){
                console.log( errorThrown );
            }
    }).done(function(){ console.log( "grab for edit Done" );
});
    getMoviesList(); 
}
//Create a String with all the Data entries to be printed to the html
function LayoutMovies(data){
    let layout = `<table><tbody id="movieData"><tr><th>Title</th><th hidden>Director</th><th>Genre</th><th hidden>ImageURL</th><th hidden>Summary</th><th hidden>Year</th><th hidden>Actors</th><th hidden>Rating</th><th hidden>Edit</th><th hidden>Delete</th></tr>`;
    
    for(let i = 0; i < data.length; i++){
        layout +=` <tr onmouseover="mOver(this)" onmouseout="mOut(this)"><td class="title-data">${data[i].title}</td><td class="director-data" hidden>${data[i].director}</td><td class="genre-data">${data[i].genre}</td><td class="imageurl-data" hidden>${data[i].imageURL}</td><td class="summary-data" hidden>${data[i].summary}</td><td class="year-data" hidden>${data[i].year}</td><td class="actors-data" hidden>${data[i].actors}</td><td class="rating-data" hidden>${data[i].rating}</td><td><button class="btn" onclick="loadMovieForm(${data[i].movieId})"><a href="#popup" text-decoration="none">Edit</a></button></td><td><button class="btn" onclick="confirmDelete(${data[i].movieId})"><i class="fas fa-trash-alt"></i></button></td></tr>`;
    }
    layout +=`</tbody></table>`;
        $("#movieDataShell").html(layout);
}


//Asks the user to verify that they wish to delete the movie.
function confirmDelete(id) {
    if (confirm("Are you sure you want to delete this movie?")) {    
      deleteMovie(id);
    } 
}
function deleteMovie(id){
    $.ajax({
        type: "DELETE",
        url: "https://localhost:44325/api/movie/" + id,
        success: function(){
            console.log( "Delete without error" )
            getMoviesList(); 
        },
        error: function( jqXhr, textStatus, errorThrown ){
            console.log( errorThrown );
            getMoviesList(); 
        }
    }).done(function(){ console.log( "Delete Done" );
});
    
        
}
    


//fills in textbox on the edit form
function editMovieForm (data){
        $("#id-edit").val(parseInt(data[0].movieId));
        $("#title-edit").val(data[0].title);
        $("#genre-edit").val(data[0].genre);
        $("#director-edit").val(data[0].director);
        $("#imageurl-edit").val(data[0].imageURL);
        $("#summary-edit").val(data[0].summary);
        $("#year-edit").val(data[0].year);
        $("#actors-edit").val(data[0].actors);
        $("#rating-edit").val(data[0].rating);
 }

//UPDATE use PUT to update current entries
function processEditForm( e ){
    var dict = {
        MovieId : parseInt(this["movieId"].value),
        Title : this["title"].value,
        Genre : this["genre"].value,
        Director : this["director"].value,
        ImageURL : this["imageurl"].value,
        Summary : this["summary"].value,
        Year : this["year"].value,
        Actors : this["actors"].value,
        Rating : this["rating"].value,

    };
    $.ajax({
        url: 'https://localhost:44325/api/movie',
        dataType: 'json',
        type: 'put',
        contentType: 'application/json',
        data: JSON.stringify(dict),
        success: function(data, textStatus, jQxhr ){
            console.log( "Update done without errors" );
            getMoviesList();
           
        },
        error: function( jqXhr, textStatus, errorThrown ){
            console.log( errorThrown );
            console.log( "Update error" );
            getMoviesList();
            
        }
    }).done(function(){ console.log( "Update done" );
    });
    document.getElementById("edit-form").reset();
    e.preventDefault();
  
   
 }
 
//CREATE NEW use POST for new entries
function processForm( e ){
    var dict = {
        Title : this["title"].value,
        Genre : this["genre"].value,
        Director : this["director"].value,
        ImageURL : this["imageurl"].value,
        Summary : this["summary"].value,
        Year : this["year"].value,
        Actors : this["actors"].value,
        Rating : this["rating"].value

    };
    $.ajax({
        url: 'https://localhost:44325/api/movie',
        dataType: 'json',
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify(dict),
        success: function( data, textStatus, jQxhr ){
            getMoviesList(); 
            console.log( "Create new done without error" );
        },
        error: function( jqXhr, textStatus, errorThrown ){
            console.log( errorThrown );
            getMoviesList(); 
        }
    }).done(function(){ console.log( "Create new done" );
});
    document.getElementById("create-form").reset();
    e.preventDefault();
    document.getElementById("myDropdown").classList.remove('show');
    
}

function processFormXX( e ){
    var dict = {
        Title : this["title"].value,
        Genre : this["genre"].value,
        Director : this["director"].value,
        ImageURL : this["imageurl"].value,
        Summary : this["summary"].value,
        Year : this["year"].value,
        Actors : this["actors"].value,
        Rating : this["rating"].value

    };

    $.ajax({
        url: 'https://localhost:44325/api/movie',
        dataType: 'json',
        type: 'get',
        contentType: 'application/json',
        data: JSON.stringify(dict),
        success: function( data, textStatus, jQxhr ){
            $('#response pre').html( data );
            getMoviesList(); 
        },
        error: function( jqXhr, textStatus, errorThrown ){
            console.log( errorThrown );
            getMoviesList(); 
        }
    });

    e.preventDefault();
    
}

$('#edit-form').submit( processEditForm );
$('#create-form').submit( processForm );
$('#search-data').submit( searchMovies );
$( function() {
    $( "#draggable" ).draggable();
  });

function mOver(obj){
    var imgString = $(obj).find('.poster-data').text();
    $("#details__poster-grid img").attr('src', $(obj).find('.imageurl-data').text());


    $("#details__genre-grid").html($(obj).find('.genre-data').text());
    $("#details__title-grid").html($(obj).find('.title-data').text());
    $("#details__director-grid").html($(obj).find('.director-data').text());
    $("#details__summary-grid").html($(obj).find('.summary-data').text());
    $("#details__year-grid").html($(obj).find('.year-data').text());
    $("#details__actors-grid").html($(obj).find('.actors-data').text());
    $("#details__rating-grid").html($(obj).find('.rating-data').text());
};
function mOut(obj){

}


