package handlers

import (
	"log"
	"unicode"
)

// New returns an error that formats as the given text.
func New(text string) error {
	return &errorString{text}
}

// errorString is a trivial implementation of error.
type errorString struct {
	s string
}

func (e *errorString) Error() string {
	return e.s
}

func validateRequest(request string) error {
	log.Print("Validating Request: ", request)
	if request == "" { //Reject if request is blank
		return &errorString{"Cannot have blank request"}
	}
	for _, r := range request { //Reject if request contains letter
		if unicode.IsLetter(r) {
			return &errorString{"Cannot have letters in response"}
		}
	}
	return nil
}
