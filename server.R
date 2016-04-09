library(shiny)
setwd('~/Documents/r/transactions/crunch')
source('transactions.r')

shinyServer(function(input, output) {
  output$distPlot <- renderPlot({
    pd <- get_processed_data('../resources/transactions.csv')
    barplot(pd$Amount, names = pd$Category, ylab = "$$$")
  })
})

