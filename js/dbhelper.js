/**
 * 
 * @description Common database helper functions.
 * @constructor
 */
class DBHelper {

  /**
   * @description Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 8002 // Change this to your server port
    return `http://localhost:${port}/data/restaurants.json`;
  }

  /**
   * @description Fetch all restaurants.
   * @param {function} callback
   */
  static fetchRestaurants(callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', DBHelper.DATABASE_URL);
    xhr.onload = () => {
      if (xhr.status === 200) { // Got a success response from server!
        const json = JSON.parse(xhr.responseText);
        const restaurants = json.restaurants;
        callback(null, restaurants);
      } else { // Oops!. Got an error from server.
        const error = (`Request failed. Returned status of ${xhr.status}`);
        callback(error, null);
      }
    };
    xhr.send();
  }

  /**
   * @description Fetch a restaurant by its ID.
   * @param {function} callback 
   * @param {integer} id - the id of the restaurant
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  /**
   * @description Fetch restaurants by a cuisine type with proper error handling.
   * @param {string} cuisine - the cuisine type
   * @param {function} callback 
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * @description Fetch restaurants by a neighborhood with proper error handling.
   * @param {string} neighborhood - the name of neighborhood
   * @param {function} callback 
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * @description Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   * @param {string} cuisine - the type of cuisine
   * @param {string} neighborhood - the name of neighborhood
   * @param {function} callback
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants;
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * @Fetch all neighborhoods with proper error handling.
   * @param {function} callback
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i);
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * @description Fetch all cuisines with proper error handling.
   * @param {function} callback
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i);
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * @description Restaurant page URL.
   * @param {object} restaurant
   * @returns {string} url
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * @description Restaurant image URLs JSON.
   * @param {object} restaurant
   * @returns {string} representationURLs
   */
  static imageUrlForRestaurant(restaurant) {
    const representationsURLs = DBHelper.imageRepresentationsPaths(restaurant.photograph);
    return representationsURLs;
  }

  /**
   * @description Paths for various image representations
   * @param {string} filename
   * @returns {string} large_1x, small_1x
   */
  static imageRepresentationsPaths(filename) {
    const [folderName, suffix] = ['./img/', 'jpg'];
    const large_1x = folderName.concat(filename, '-512_1x', '.', suffix);
    const small_1x = folderName.concat(filename, '-380_1x', '.', suffix);

    return {
      large_1x: large_1x,
      small_1x: small_1x,
    };
  }


  /**
   * @description Map marker for a restaurant.
   * @param {object} restaurant
   * @param {object} map
   * @returns {object} marker
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  }

}
