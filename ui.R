library(shiny)

d3 <- function(inputoutputID) {
  div(id=inputoutputID,class=inputoutputID)
}

# define UI for application that draws a histogram
shinyUI(fluidPage(
  # App title
  titlePanel("lmao money hahahaha"),

  fluidRow(
    column(12, 
      textOutput("moneyPerDay")
    )
  ),

  fluidRow(
    column(12,
      d3("barplot")
    )
  ),
  
  fluidRow(
    column(12, 
      includeHTML("amount_by_category.html")
    )
  )
))
