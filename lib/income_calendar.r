source('lib/common.r')

generate_income_calendar <- function(preprocessed_data) {
  # transform transaction data
  Categories <- sapply(unique(preprocessed_data$Category), toString)

  Amounts <- lapply(Categories, function(c) { sum(preprocessed_data[preprocessed_data$Category == c,]$Amount) })

  Categories <- c('Taxes', Categories)
  Amounts <- c(2908, Amounts)
  Amounts <- as.numeric(Amounts)
 
  cal <- data.frame(Categories, Amounts)
  cal[order(-cal$Amounts),]
}
