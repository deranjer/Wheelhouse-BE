package main

import (
	"flag"
	"fmt"
	"net/http"
	"os"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/go-chi/docgen"
	"github.com/go-chi/render"
)

var routes = flag.Bool("routes", false, "Generate router documentation")

func main() {
	flag.Parse()
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

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Welcome to the root of WheelhouseBE"))
	})

	r.Route("/user", func(r chi.Router) {
		r.Get("/{userID}", GetUserByID) //GET /user/123
	})

	if *routes { //If asking for routes to be printed to .md file
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
			fmt.Println(bytesWritten, " bytes written to file")
		}

		return

	}

	http.ListenAndServe(":5000", r)

}

//GetUserByID Get user from database by ID
func GetUserByID(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Request user by ID"))
}
