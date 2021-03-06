daily_spending_amt <- function(transaction_rows) {
  sum(transaction_rows$Amount) / as.numeric(max(transaction_rows$Date) - min(transaction_rows$Date))
}

get_daily_spending_amt <- Compose(get_expenses, daily_spending_amt)
