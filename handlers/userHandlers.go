package handlers

import (
	"net/http"
)

// UserCtx middleware is used to load a User object from
// the URL parameters passed through as the request. In case
// the User could not be found, we stop here and return a 404.
func UserCtx(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		//Here we would search DB
	})
}

//GetUserByID Get user from database by ID
func GetUserByID(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Request user by ID"))
}

//DeleteUserByID deletes a user from the database by ID
func DeleteUserByID(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("DeletedUser by ID"))
}

//CreateUser creates a new user
func CreateUser(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("CreateUser and generate ID"))
}

//UpdateUserByID changes fields for an existing user
func UpdateUserByID(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Updating User by ID"))
}
