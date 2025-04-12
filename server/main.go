package main

// to run:
// go run . serve

import (
	"fmt"
	"log"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func createUserProfile(e *core.RecordEvent) error {
	// Find the "profiles" collection.
	collection, err := e.App.FindCollectionByNameOrId("profiles")
	if err != nil {
		return fmt.Errorf("failed to find profiles collection: %w", err)
	}

	// Create a new record for the "profiles" collection.
	profile := core.NewRecord(collection)
	profile.Set("userId", e.Record.Id) 
	profile.Set("name", e.Record.GetString("name")) 
	profile.Set("email", e.Record.GetString("email")) 
	profile.Set("location", "This is a default location.") 
	profile.Set("bio", "This is a default bio.") 
	profile.Set("profilePicture", "https://example.com/default-profile-picture.png") 

	// Save the new profile record.
	if err := e.App.Save(profile); err != nil {
		return fmt.Errorf("failed to save profile for user %s: %w", e.Record.Id, err)
	}

	return e.Next()
}

func main() {
	app := pocketbase.New()
	app.OnRecordAfterCreateSuccess("users").BindFunc(createUserProfile)

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
