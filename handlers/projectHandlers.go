package handlers

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"
)

type projectData struct {
	ID             int       `json:"id"`
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
	projectID := chi.URLParam(r, "projectID")
	err := validateRequest(projectID) //In common.go, this is where we will add all our validation routines
	if err != nil {
		log.Print("Invalid User ID entered, stopping before database hit, error was: ", err, " Requested ID was: ", projectID)
		w.Write([]byte("Must enter a valid userID to perform a GET, hit error: " + err.Error())) //Might redirect user to their own homepage?  OR 404? Not sure.
		return
	}
	err = DB.QueryRow(`SELECT name, logo_url, header_photo_url, tagline, description, created_at FROM projects WHERE id = $1`, projectID).Scan(&getProject.Name, &getProject.LogoURL, &getProject.HeaderPhotoURL, &getProject.Tagline, &getProject.Description, &getProject.CreatedAt) //TODO verify the username and password against the database to make sure it works
	if err != nil {
		log.Print("Error Running Query Select for Project: ", err)
		render.HTML(w, r, "This is a 404 or error we can't find that project ID: "+projectID+err.Error())
		return
	}
	log.Print("Result of query", getProject.Name)
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

//UpdateProjectByID deletes a user from the database by ID
func UpdateProjectByID(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Update Project by ID"))
}

//DeleteProjectByID deletes a user from the database by ID
func DeleteProjectByID(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Delete Project by ID"))
}
