package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"

	//Need pq to read/write from sql
	_ "github.com/lib/pq"
)

var (
	//DB is the database connection that was exported from main
	DB *sql.DB
)

type userData struct {
	ID              int    `json:"id"`
	FullName        string `json:"full_name"`
	Username        string `json:"username"`
	Email           string `json:"email"`
	Password        string `json:"password"`
	ProfilePhotoURL string `json:"profile_photo_url"`
	HeaderPhotoURL  string `json:"header_photo_url"`
	WorkStatus      string `json:"work_status"`
	Bio             string `json:"bio"`
	Tagline         string `json:"tagline"`
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
	getUser := &userData{}
	userID := chi.URLParam(r, "userID")
	err := validateRequest(userID) //In common.go, this is where we will add all our validation routines
	if err != nil {
		log.Print("Invalid User ID entered, stopping before database hit, error was: ", err, " Requested ID was: ", userID)
		w.Write([]byte("Must enter a valid userID to perform a GET, hit error: " + err.Error())) //Might redirect user to their own homepage?  OR 404? Not sure.
		return
	}
	err = DB.QueryRow(`SELECT full_name, username, profile_photo_url, header_photo_url, work_status, bio, tagline FROM users WHERE id = $1`, userID).Scan(&getUser.FullName, &getUser.Username, &getUser.ProfilePhotoURL, &getUser.HeaderPhotoURL, &getUser.WorkStatus, &getUser.Bio, &getUser.Tagline) //TODO verify the username and password against the database to make sure it works
	if err != nil {
		log.Print("Error Running Query Select for Users: ", err)
		render.HTML(w, r, "This is a 404, we can't find that user ID: "+userID)
		return
	}
	log.Print("Query completed correctly for user: ", getUser.FullName)
	getUserJSON, err := json.Marshal(getUser)
	w.Write([]byte(getUserJSON))
}

//DeleteUserByID deletes a user from the database by ID
func DeleteUserByID(w http.ResponseWriter, r *http.Request) {
	userID := chi.URLParam(r, "userID")
	err := validateRequest(userID) //In common.go, this is where we will add all our validation routines
	if err != nil {
		log.Print("Invalid User ID entered, stopping before database hit, error was: ", err, " Requested ID was: ", userID)
		w.Write([]byte("Must enter a valid userID to perform a DELETE, hit error: " + err.Error())) //Might redirect user to their own homepage?  OR 404? Not sure.
		return
	}
	result, err := DB.Exec(`DELETE FROM users where id = $1`, userID)
	if err != nil {
		log.Print("Error deleting user by ID", userID)
		return
	}
	log.Print("Sql Result", result)
	w.Write([]byte("Deleted User by ID" + userID))
}

//CreateUser creates a new user
func CreateUser(w http.ResponseWriter, r *http.Request) {
	newUser := &userData{}
	bodyBytes, _ := ioutil.ReadAll(r.Body)
	fmt.Println("Received body: ", string(bodyBytes))
	err := json.Unmarshal(bodyBytes, newUser)
	if err != nil {
		log.Print("Unable to create new user: ", err)
		return
	}
	fmt.Println(newUser)
	w.Write([]byte("Received JSON, creating user"))
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
	getUser := &userData{}
	bodyBytes, _ := ioutil.ReadAll(r.Body)
	fmt.Println("Received body: ", string(bodyBytes))
	err := json.Unmarshal(bodyBytes, getUser)
	if err != nil {
		log.Print("Unable to Update user: ", err)
		return
	}
	userID := chi.URLParam(r, "userID")
	err = validateRequest(userID) //In common.go, this is where we will add all our validation routines
	if err != nil {
		log.Print("Invalid User ID entered, stopping before database hit, error was: ", err, " Requested ID was: ", userID)
		w.Write([]byte("Must enter a valid userID to perform a GET, hit error: " + err.Error())) //Might redirect user to their own homepage?  OR 404? Not sure.
		return
	}
	sqlStatement := `
	UPDATE users 
	SET full_name = $2, username = $3, email = $4, password = $5, profile_photo_url = $6, header_photo_url = $7
	WHERE id = $1`
	result, err := DB.Exec(sqlStatement, userID, getUser.FullName, getUser.Username, getUser.Email, getUser.Password, getUser.ProfilePhotoURL, getUser.HeaderPhotoURL)
	if err != nil {
		log.Print("Error updating user by ID ", userID, " Error:", err.Error())
		return

	}
	log.Print("Sql Result", result)
	log.Print("Update completed correctly for user: ", getUser.FullName)
	updateUserJSON, err := json.Marshal(getUser)
	w.Write([]byte(updateUserJSON))
}
