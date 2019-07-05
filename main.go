package main

import (
	"WheelhouseBE/handlers"
	"database/sql"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/alexedwards/scs/v2"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/go-chi/docgen"
	"github.com/go-chi/render"
	_ "github.com/lib/pq"
)

// Credentials will create a struct that models the structure of a user, both in the request body, and in the DB
type Credentials struct {
	Password string `json:"password"`
	Username string `json:"username"`
}

var (
	routes         = flag.Bool("routes", false, "Generate route documentation")
	sessionManager *scs.SessionManager
	connStr        = "user=postgres password=Password1 port=5432 host=192.168.1.9 dbname=wheelhouse-test"
	//DB is the database connection that will be injected into other packages
	DB *sql.DB
)

func main() {
	databaseSetup() // setting up the connection to database
	flag.Parse()
	// Initialize a new session manager and configure the session lifetime.
	sessionManager = scs.New()
	sessionManager.Lifetime = 24 * time.Hour
	cors := cors.New(cors.Options{
		// AllowedOrigins: []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{"*"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	})

	r := chi.NewRouter()
	r.Use(cors.Handler)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(render.SetContentType(render.ContentTypeJSON))

	r.Get("/", aPIRoot)

	r.Post("/login", userLogin)

	r.Route("/user", func(r chi.Router) {
		r.Post("/", handlers.CreateUser)
		r.Route("/{userID}", func(r chi.Router) {
			//r.Use(handlers.UserCtx)
			r.Get("/", handlers.GetUserByID)
			r.Put("/", handlers.UpdateUserByID)
			r.Delete("/", handlers.DeleteUserByID)
		})
	})

	if *routes { //If asking for routes to be printed to .md file
		GenerateDocs(r)
	}
	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}
	fmt.Printf("Starting server on port %v\n", port)
	http.ListenAndServe(":"+port, sessionManager.LoadAndSave(r))
}

//GenerateDocs prints out the API to a markdown file
func GenerateDocs(r *chi.Mux) {
	routeDocs := docgen.MarkdownRoutesDoc(r, docgen.MarkdownOpts{
		ProjectPath: "",
		Intro:       "Generated Docs for WheelhouseBE",
	})
	file, err := os.Create("RouteDocs.md")
	if err != nil {
		fmt.Println("Error creating file")
	}
	bytesWritten, err := file.WriteString(routeDocs)
	if err != nil {
		fmt.Println("Error writing to file")
	} else {
		fmt.Println(bytesWritten, "bytes written to RouteDocs.md")
	}

	return
}

//UserLogin handles the user login, creates the session cookie
func userLogin(w http.ResponseWriter, r *http.Request) {
	var creds Credentials
	err := json.NewDecoder(r.Body).Decode(&creds) //Take the credentials from post and decode them into the struct
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	result, err := DB.Query(`SELECT full_name FROM users WHERE id = 1`) //TODO verify the username and password against the database to make sure it works
	if err != nil {
		log.Print("Error Running Query Select for Users: ", err)
	} else {
		log.Print("Result of query", result)
	}
}

//APIRoot displays a welcome message to the API
func aPIRoot(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Welcome to the root of WheelhouseBE"))
}

func databaseSetup() {
	var err error
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Unable to open database", err)
	} else {
		fmt.Println("Database Connection Established")
	}
	handlers.DB = DB //injecting the database connection into handlers
}
