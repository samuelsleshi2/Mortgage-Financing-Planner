import java.text.NumberFormat;
import java.util.Scanner;

//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.
public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

// Prompting user for principal
        double principal;
            while (true) {
                System.out.print("Principal ($1K - $1M): ");
                if (!scanner.hasNextDouble()) {
                    scanner.next();
                    System.out.println("Enter a numeric value.");
                } else {
                    principal = scanner.nextDouble();
                    if (principal >= 1000 && principal <= 1000000) {
                        break;
                    } else if (principal < 1000 || principal > 1000000) {
                        System.out.println("Enter a number between 1,000 and 1,000,000.");
                    }
                }
            }

// Prompting user for annual interest
            double annualInterest;
            while (true) {
                System.out.print("Annual interest rate (up to 30%): ");
                if (!scanner.hasNextDouble()) {
                    scanner.next();
                    System.out.println("Enter a numeric value.");
                } else {
                    annualInterest = scanner.nextDouble();
                    if (annualInterest > 0 && annualInterest <= 30) {
                        break;
                    } else if (annualInterest <= 0 || annualInterest > 30) {
                        System.out.println("Enter a value greater than 0 and less than or equal to 30.");
                    }
                }
            }

            // Prompting user for years
        double years;
        while (true) {
            System.out.print("Period (1-30 years): ");
            if (!scanner.hasNextDouble()) {
                scanner.next();
                System.out.println("Enter a numeric value.");
            }
            else {
                years = scanner.nextDouble();
                if (years > 0 && years <= 30) {
                    break;
                } else if (years <= 0 || years > 30) {
                    System.out.println("Enter a value greater than 0 and less than or equal to 30");
                }
            }
        }

        double monthlyInterest = annualInterest / 100 / 12;
        double numberOfPayments = years * 12;

        // Calculating result of mortgage payment
        double mortgage = principal
                * (monthlyInterest * Math.pow(1 + monthlyInterest, numberOfPayments)
                / (Math.pow(1 + monthlyInterest, numberOfPayments) - 1));
        String mortgageFormatted = NumberFormat.getCurrencyInstance().format(mortgage);
        System.out.println("Monthly mortgage payment: " + mortgageFormatted);
    }
}