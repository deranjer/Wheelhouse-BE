package main

import (
	"database/sql"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	_ "github.com/lib/pq"
	"gopkg.in/testfixtures.v2"
)

var (
	db       *sql.DB
	fixtures *testfixtures.Context
)

func DBSetup(m *testing.M) {
	var err error
	connStr := "user=postgres password=postgres port=5432 host=postgres dbname=wheelhouse-test "
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	fixtures, err = testfixtures.NewFolder(db, &testfixtures.PostgreSQL{}, "testdata/fixtures")
	if err != nil {
		log.Fatal(err)
	}
	os.Exit(m.Run())
}

func PrepareTestDatabase() {
	if err := fixtures.Load(); err != nil {
		log.Fatal(err)
	}
}

func TestDBConnection(t *testing.T) {
	PrepareTestDatabase()
	_, err := db.Query(`SELECT full_name FROM users WHERE id = 1`)
	if err != nil {
		log.Fatal(err)
	}

}

func TestAPIGets(t *testing.T) {
	APIBaseGet(t, "/", "Welcome to the root of WheelhouseBE") //Test Root
}

func APIBaseGet(t *testing.T, uri string, expected interface{}) {
	req, err := http.NewRequest("GET", uri, nil)
	if err != nil {
		t.Fatal(err)
	}
	// We create a ResponseRecorder (which satisfies http.ResponseWriter) to record the response.
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(APIRoot)

	// Our handlers satisfy http.Handler, so we can call their ServeHTTP method
	// directly and pass in our Request and ResponseRecorder.
	handler.ServeHTTP(rr, req)

	// Check the status code is what we expect.
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	// Check the response body is what we expect.
	if rr.Body.String() != expected {
		t.Errorf("handler returned unexpected body \n\tgot: %+v\n\twant: %+v",
			rr.Body.String(), expected)
	}

}
