# Punch Out

The fifth weekend project at Prime Digital Academy was a larger, extended project for which we were given two days of in-class time, as well as the weekend, to work on it. Out of three choices for projects, I chose a project time tracker application.

In this app, you are able to add a time entry for a project, including the date, start time, and end time. All entries are displayed in a table. A similar page exists for managing projects, where you may add or delete a project. Deleting a project also deletes all of that project's associated time entries. The table on the projects page displays the total hours worked on that project (sum of hours for all entries for that project).

## Built With

AngularJS, Node, Express, PosgreSQL

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Installing

Steps to get the development environment running.

1. Download this project.
2. `npm install`
3. `npm start`

And so on...

## Screen Shot

Include one or two screen shots of your project here (optional). Remove if unused.

### Completed Features

High level list of items completed.

- [x] Home Page
  - [x] Create navbar with client-side routes
    - [x] Add Entry
    - [x] Manage Projects
    - [x] Reports
- [x] Entries View
  - [x] Create add entry form
    - [x] text input
    - [x] project select
      - [x] get list of projects from database
    - [x] date input
    - [x] start time input
    - [x] end time input
    - [x] submit button
      - [x] call vm.deleteEntry function on click
  - [x] Create entries table with ng-repeat
    - [x] delete feature for each row
      - [x] call vm.deleteEntry function on delete cell click
- [x] Projects View
  - [x] Create add project form
    - [x] project name input
    - [x] submit button
      - [x] call vm.addProject function on button click
  - [x] Create projects table with ng-repeat
    - [x] project name
    - [x] project total hours
      - [x] create custom SUM/JOIN SQL query
    - [x] delete feature for each row
      - [x] call vm.deleteProject function on delete cell click

  ???

### Stretch Goals

Features that you would like to add at some point in the future.

- [x] edit project name in project table
  - [x] double-click cell to edit name
    - [x] save and cancel buttons
- [ ] sort entries by columns, ascending or descending
- [ ] prevent user for creating a time entry that overlaps with an existing one
- [ ] Reports View
  - [ ] learn Chart.js for creating reports
  - [ ] all projects with total hours for each (bar chart)

## Authors

* Paul Heggeseth
