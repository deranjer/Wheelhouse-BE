package handlers

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
	"time"
)

type projectData struct {
	Name           string    `json:"name"`
	UserID         string    `json:"user_id"`
	LogoURL        string    `json:"logo_url"`
	HeaderPhotoURL string    `json:"header_photo_url"`
	Tagline        string    `json:"tagline"`
	Description    string    `json:"description"`
	CreatedAt      time.Time `json:"created_at"`
}

//GetProjectByID Get user from database by ID
func GetProjectByID(w http.ResponseWriter, r *http.Request) {

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

//CreateProject takes the data from client and generates a new project
func CreateProject(w http.ResponseWriter, r *http.Request) {
	newProject := &projectData{}
	bodyBytes, _ := ioutil.ReadAll(r.Body)
	fmt.Println("Received body: ", string(bodyBytes))
	err := json.Unmarshal(bodyBytes, newProject)
	if err != nil {
		log.Print("Unable to create new user: ", err)
		return
	}
	fmt.Println(newProject)
	w.Write([]byte("Received JSON, creating project"))
	sqlStatement := `
	INSERT INTO users (name, user_id, logo_url, header_photo_url, tagline, description, created_at)
	VALUES ($1, $2, $3, $4, $5, $6)`
	result, err := DB.Exec(sqlStatement, newProject.Name, newProject.UserID, newProject.LogoURL, newProject.HeaderPhotoURL, newProject.Tagline, newProject.Description, newProject.CreatedAt)
	if err != nil {
		panic(err)
	} else {
		fmt.Println("Sql Result", result)
	}
}
