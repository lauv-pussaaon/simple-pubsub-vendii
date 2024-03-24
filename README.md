# Project Title

Machine Stock Management Service with Pub-Sub in TypeScript

## Overview

This Node.js/TypeScript project demonstrates a publish-subscribe system for managing machine stock levels. It utilizes TDD and includes features like a machine repository and the Maybe concept.

## Technologies

-   TypeScript
-   Node.js

## Patterns

-   Publish-Subscribe
-   Repository

## Practices

-   Test-Driven Development (TDD)
-   Jest (unit testing)

## Features

-   Event-driven stock updates
-   MachineRefillSubscriber, MachineSaleSubscriber
-   StockWarningSubscirber for stock threshold events (StockLevelLowEvent, StockLevelOkEvent, StockLevelInsufficientEvent)
-   Subscribers can conditionally generate new events back to the publisher
-   Maybe (for optional value handling)

## Getting Started

1. Prerequisites: Node.js
2. Installation: npm install
3. Run Tests: npm test

## Core Requirements

-   Implement a publish-subscribe system (IPublishSubscribeService, ISubscriber).
-   Subscribers manage a shared array of machines, mutating stock based on events.
-   Add unsubscribe functionality.
-   Introduce MachineRefillSubscriber to increase machine stock.
-   Generate stock threshold events (LowStockWarningEvent, StockLevelOkEvent) with logic to fire only once per threshold crossing.

### Extra Enhancements

-   Machine repository for data management.
-   Maybe concept for error handling.
