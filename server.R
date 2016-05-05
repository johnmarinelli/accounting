library(shiny)
library(functional) # for Curry
source('lib/amount_vs_category.r')
source('lib/income_calendar.r')
source('lib/daily_spending.r')

shinyServer(function(input, output) {
  expenses <- get_expenses('data/transactions.csv')
  get_rows <- Curry(get_rows_by_daterange, rows = expenses)

  output$moneyPerDay <- renderText({
    daily_spending <- get_daily_spending_amt('data/transactions.csv')
    format_currency(daily_spending)
  })

  output$barplot <- function() {
    date_range <- if (is.null(input$dateRange)) get_month_range() else input$dateRange
    rows <- get_rows(date_range)
    get_amount_by_category(rows)    
  }

  output$incomeCalendar <- function() {
    date_range <- c('2016-03-01', '2016-03-31') #get_month_range()
    rows <- get_rows(date_range)
    generate_income_calendar(rows)
  }

  output$dateRange <- renderUI({
    dateRangeInput("dateRange", "", start = min(expenses$Date), end = Sys.Date())
  })
 
})

