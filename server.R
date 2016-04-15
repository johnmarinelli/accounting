library(shiny)
source('lib/helpers.r')

shinyServer(function(input, output) {
  output$moneyPerDay <- renderText(
    paste("You've spent an average of",  get_daily_spending_amt('data/transactions.csv'), "daily.", sep = " ")
  )

  output$barplot <- function() {
    get_processed_data('data/transactions.csv')
  }
})

