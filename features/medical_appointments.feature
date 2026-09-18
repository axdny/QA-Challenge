Feature: Medical appointment management
  As a registered patient
  I want to manage my medical appointments
  So that I can book and verify my healthcare visits

  Background:
    Given I am on the MedAppoint login page

  @smoke @login
  Scenario: Sign in and verify the authenticated user
    When I sign in with my configured credentials
    Then I should see the authenticated user email

  @booking
  Scenario: Book an appointment with a doctor
    When I sign in with my configured credentials
    And I select the first available doctor
    And I book the first available appointment slot
    Then the appointment should be booked successfully

  @appointments
  Scenario: Verify the booked appointment in Appointments
    When I sign in with my configured credentials
    And I select the first available doctor
    And I book the first available appointment slot
    And I open the Appointments section
    Then I should see the appointment booked for the selected date