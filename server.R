library(shiny)
source('lib/helpers.r')

shinyServer(function(input, output) {
  preprocessed_data <- get_preprocessed_data('data/transactions.csv')

  output$moneyPerDay <- renderText(
    format_currency(get_daily_spending_amt('data/transactions.csv'))
  )

  output$barplot <- function() {
    date_range <- input$dateRange
    preprocessed_data <- get_preprocessed_data('data/transactions.csv')
    get_amount_by_category(get_rows_by_daterange(format(date_range[1]), format(date_range[2]), preprocessed_data))    
  }

  output$incomeCalendar <- function() {
#    date_range <- if (is.null(input$dateRange)) get_month_range() else input$dateRange
    date_range <- c('2016-03-01', '2016-03-30')
print("Hello from income calendar")
print(date_range)
    preprocessed_data <- get_preprocessed_data('data/transactions.csv')
    filtered_data <- get_rows_by_daterange(format(date_range[1]), format(date_range[2]), preprocessed_data)
    generate_income_calendar(filtered_data)
  }

  output$dateRange <- renderUI({
    dateRangeInput("dateRange", "", start = min(preprocessed_data$Date), end = Sys.Date())
  })
 
})

