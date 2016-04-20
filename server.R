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
    process(get_rows_by_daterange(format(date_range[1]), format(date_range[2]), preprocessed_data))    
  }

  output$dateRange <- renderUI({
    dateRangeInput("dateRange", "", start = min(preprocessed_data$Date), end = Sys.Date())
  })
 
})

