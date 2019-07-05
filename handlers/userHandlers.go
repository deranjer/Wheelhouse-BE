package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"

	//Need pq to read/write from sql
	_ "github.com/lib/pq"
)

var (
	//DB is the database connection that was exported from main
	DB *sql.DB
)

type userData struct {
	FullName        string `json:"full_name"`
	Username        string `json:"username"`
	Email           string `json:"email"`
	Password        string `json:"password"`
	ProfilePhotoURL string `json:"profile_photo_url"`
	HeaderPhotoURL  string `json:"header_photo_url"`
	WorkStatus      string `json:"work_status"`
	Bio             string `json:"bio"`
}

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
	newUser := &userData{}
	bodyBytes, _ := ioutil.ReadAll(r.Body)
	fmt.Println("Recieved body: ", string(bodyBytes))
	err := json.Unmarshal(bodyBytes, newUser)
	if err != nil {
		log.Print("Unable to create new user: ", err)
		return
	}
	fmt.Println(newUser)
	w.Write([]byte("Recieved JSON, creating user"))
	sqlStatement := `
	INSERT INTO users (full_name, username, email, password, profile_photo_url, header_photo_url)
	VALUES ($1, $2, $3, $4, $5, $6)`
	result, err := DB.Exec(sqlStatement, newUser.FullName, newUser.Username, newUser.Email, newUser.Password, newUser.ProfilePhotoURL, newUser.HeaderPhotoURL)
	if err != nil {
		panic(err)
	} else {
		fmt.Println("Sql Result", result)
	}
}

//UpdateUserByID changes fields for an existing user
func UpdateUserByID(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Updating User by ID"))
}
