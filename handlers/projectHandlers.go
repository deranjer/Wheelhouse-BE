package handlers

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
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
	getProject := projectData{}
	err := DB.QueryRow(`SELECT full_name, username, profile_photo_url, header_photo_url, work_status, bio, tagline FROM users WHERE id = $1`, 1).Scan(&getProject.Name, &getProject.UserID, &getProject.LogoURL, &getProject.HeaderPhotoURL, &getProject.Tagline, &getProject.Description, &getProject.CreatedAt) //TODO verify the username and password against the database to make sure it works
	if err != nil {
		log.Print("Error Running Query Select for Project: ", err)
	} else {
		log.Print("Result of query", getProject.Name)
	}
	getProjectJSON, err := json.Marshal(getProject)
	w.Write([]byte(getProjectJSON))
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

//DeleteUserByID deletes a user from the database by ID
func UpdateProjectByID(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Update Project by ID"))
}

//DeleteUserByID deletes a user from the database by ID
func DeleteProjectByID(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Delete Project by ID"))
}
