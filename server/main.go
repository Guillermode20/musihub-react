package main

// to run:
// go run . serve

import (
	"log"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func createUserProfile(e *core.RecordEvent) error {
	app := pocketbase.New()
	// Find the "profiles" collection.
	collection, err := app.FindCollectionByNameOrId("profiles")
	if err != nil {
		log.Printf("profiles collection not found: %v", err)
		return e.Next()
	}

	// Create a new record for the "profiles" collection.
	profile := core.NewRecord(collection)
	profile.Set("userId", e.Record.Id) 
	profile.Set("name", e.Record.GetString("name")) 
	profile.Set("email", e.Record.GetString("email")) 
	profile.Set("location", "This is a default location.") 
	profile.Set("bio", "This is a default bio.") 
	profile.Set("profilePicture", "https://example.com/default-profile-picture.png") 
	profile.Set("createdAt", e.Record.Collection().Created) 
	profile.Set("updatedAt", e.Record.Collection().Updated) 

	// Save the new profile record.
	if err := app.Save(profile); err != nil {
		log.Printf("failed to save profile for user %s: %v", e.Record.Id, err)
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
