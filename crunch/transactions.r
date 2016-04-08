library(functional) # for Compose
library(rjson) # for writing to JSON

get_rows_by_daterange <- function(begin_date, end_date, rows, date_col_name = "Date") {
  rows[rows[date_col_name] > begin_date & rows[date_col_name] < end_date,]
}

# Returns a data.frame of Category | Frequency
x_by_y <- function(rows, freq_col_name = "Frequency", cat_col_name = "Category") {
  x_by_y <- data.frame(rows[freq_col_name], rows[cat_col_name])
  colnames(x_by_y) <- c(freq_col_name, cat_col_name)
  agg <- aggregate(rows[freq_col_amt], by = list(Category = rows[cat_col_name]), sum)
}

# dates come in m/dd/yyyy format
factor_to_date <- function(fdate) {
  as.Date(fdate, "%m/%d/%Y")
}

# get toal amount spent by category
amount_by_category <- function(transactions) {
  #amt_cat <- data.frame(transactions$Amount, transactions$Category)
  #colnames(amt_cat) <- c("Amount", "Category")
  #aggregate(amt_cat$Amount, by = list(Category = amt_cat$Category), sum)
  x_by_y(transactions, "Amount", "Category")
}

get_daily_spending_amt <- function(rows) {
  sum(transactions$Amount) / as.Numeric(max(rows$Date) - min(rows$Date))
}

load <- function(filepath) {
  read.csv(filepath)
}

preprocess <- function(raw_data) {
  date_origin <- '1970-01-01'
  
  # transform factors to dates
  raw_data$Date <- as.Date(unlist(lapply(raw_data$Date, factor_to_date)), origin = date_origin)  
  preprocessed_data <- raw_data
}

process <- function(preprocessed_data) {
  amt_by_cat <- amount_by_category(processed_data) 
}

writeout <- function(processed_data) {
  json <- toJSON(unname(split(processed_data, 1:nrow(processed_data)))) 
  write(json, file = '../resources/processed.json')
}


# load -> preprocess -> process -> writeout
program <- Compose(load, preprocess, process, writeout)
program('../resources/transactions.csv')
