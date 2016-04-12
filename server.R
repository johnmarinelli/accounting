library(shiny)
source('helpers.r')

shinyServer(function(input, output) {
  #output$distPlot <- renderPlot({
  #  pd <- get_processed_data('data/transactions.csv')
  #  barplot(pd$Amount, names = pd$Category, ylab = "$$$")
  #})

  output$moneyPerDay <- renderText(get_daily_spending_amt('assets/data/transactions.csv'))

  d3data <- reactive(function() {
    list(rnorm(1) * 400 + 200, rnorm(1) * 400 + 200)
  })

  output$barplot <- function() {
    get_processed_data('assets/data/transactions.csv')
  }
})

