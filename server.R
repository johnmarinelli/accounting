library(shiny)
source('lib/helpers.r')

shinyServer(function(input, output) {
  output$moneyPerDay <- renderText(get_daily_spending_amt('data/transactions.csv'))

  d3data <- reactive(function() {
    list(rnorm(1) * 400 + 200, rnorm(1) * 400 + 200)
  })

  output$barplot <- function() {
    get_processed_data('data/transactions.csv')
  }
})

