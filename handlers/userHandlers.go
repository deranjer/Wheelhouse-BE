package handlers

import (
	"database/sql"
	"log"
	"net/http"
	"strings"

	_ "github.com/lib/pq"
)

var (
	DB *sql.DB
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

	result, err := DB.Query(`SELECT full_name FROM users WHERE id = 1`) //TODO verify the username and password against the database to make sure it works
	if err != nil {
		log.Print("Error Running Query Select for Users: ", err)
	} else {
		log.Print("Result of query", result)
	}
	singleColumn, err := result.Columns()
	if err != nil {
		log.Print("Error with results")
	}
	singleColumnString := strings.Join(singleColumn, "")
	w.Write([]byte(singleColumnString))
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
