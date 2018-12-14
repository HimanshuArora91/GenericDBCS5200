# GenericDBCS5200


URL for app : https://cs5200-generic-db.herokuapp.com/

This will serve as the base URL for all Http request.


Youtube Link  : https://youtu.be/nrNnooJc3FI


Postman URL link : https://www.getpostman.com/collections/0e38b16e85abffe22421

https://web.postman.co/collections/2161284-7f9336dd-233c-4af0-819f-00b248ae6f9f?workspace=1fc658bd-9f89-485f-8889-9a4cd1685408

List Of Postman URL's

## Single Table Test
* GET https://cs5200-generic-db.herokuapp.com/api/actor

* POST https://cs5200-generic-db.herokuapp.com/api/actor
 
  {
	  "name" : "Harrison"
  }

* POST https://cs5200-generic-db.herokuapp.com/api/actor

  {
	  "name" : "Joe"
  }

* POST https://cs5200-generic-db.herokuapp.com/api/actor

  {
	  "first" : "Ryan",
  	"Last" : "Goslyn"
  }

* GET https://cs5200-generic-db.herokuapp.com/api/actor

* PUT https://cs5200-generic-db.herokuapp.com/api/movie/5c12ac33fe1a680016cb56ee

  {
	  "first" : "Ryan",
  	"Last" : "Goslyn"
  }
   

* PUT https://cs5200-generic-db.herokuapp.com/api/actor/SomeWrongId

* PUT https://cs5200-generic-db.herokuapp.com/api/actor/5c12ac41fe1a680016cb56ef
  {
	  "name" : "Joseph"
  }

* PUT https://cs5200-generic-db.herokuapp.com/api/actor/5c12ac41fe1a680016cb56ef
  {
	  "nombre" : "Jose"
  }


* DELETE https://cs5200-generic-db.herokuapp.com/api/movie/5c12ac41fe1a680016cb56ef


* DELETE https://cs5200-generic-db.herokuapp.com/api/actor/SomeWrongId

* DELETE https://cs5200-generic-db.herokuapp.com/api/actor/5c12ac41fe1a680016cb56ef

* POST https://cs5200-generic-db.herokuapp.com/api/movie
  {
	  "title" : "Blade Runner"
  }

* POST https://cs5200-generic-db.herokuapp.com/api/movie
  {
	  "title" : "La La Land"
  }


## Two Table Test

* POST https://cs5200-generic-db.herokuapp.com/api/actor/5c12ac33fe1a680016cb56ee/movie/5c12adf6fe1a680016cb56f2

* POST https://cs5200-generic-db.herokuapp.com/api/actor/5c12ac5efe1a680016cb56f0/movie/5c12adf6fe1a680016cb56f2

* POST https://cs5200-generic-db.herokuapp.com/api/actor/5c12ac5efe1a680016cb56f0/movie/5c12adfffe1a680016cb56f3

* GET https://cs5200-generic-db.herokuapp.com/api/actor/5c12ac5efe1a680016cb56f0/movie

* GET https://cs5200-generic-db.herokuapp.com/api/movie/5c12adf6fe1a680016cb56f2/actor

* DELETE https://cs5200-generic-db.herokuapp.com/api/movie/5c12adf6fe1a680016cb56f2/actor/5c12ac33fe1a680016cb56ee

* DELETE https://cs5200-generic-db.herokuapp.com/api/actor/5c12ac5efe1a680016cb56f0/movie

