# Project Title

Machine Stock Management Service with Pub-Sub in TypeScript

## Overview

This Node.js/TypeScript project demonstrates a publish-subscribe system for managing machine stock levels. It utilizes TDD and includes features like a machine repository and the Maybe concept.

## Technologies & Design

-   TypeScript
-   Node.js

### Patterns

-   Publish-Subscribe
-   Repository

### Practices

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
4. Run a sample simulation: ts-node src/app.ts

## Core Requirements

-   Implement a publish-subscribe system (IPublishSubscribeService, ISubscriber).
-   Subscribers manage a shared array of machines, mutating stock based on events.
-   Add unsubscribe functionality.
-   Introduce MachineRefillSubscriber to increase machine stock.
-   Generate stock threshold events (LowStockWarningEvent, StockLevelOkEvent) with logic to fire only once per threshold (3) crossing.

### Extra Enhancements

-   Machine repository for data management.
-   Maybe concept to handle optional values and facilitate functional programming.

### Original Instructions

    1. Build the Publish-Subscribe mechanism. Allow ISubscriber objects to register against an concrete IPublishSubscribeService object for an event type. Implement the publish method so that when a publish event occurs, all subscribers of that the event type published will have a chance to handle the event. The subscribers should be working off a shared array of Machine objects, mutating them depending on the event received.

    2. Now add the method 'unsubscribe' on IPublishSubscribeService to allow handlers to unsubscribe from events. You may change the existing method signatures.

    3. Implement MachineRefillSubscriber. It will increase the stock quantity of the machine.

    4. Let's add some new behaviour. If a machine stock levels drops below 3 a new Event, LowStockWarningEvent should be generated. When the stock levels hits 3 or above (because of a MachineRefillEvent), a StockLevelOkEvent should be generated. For each machine, LowStockWarningEvent or StockLevelOkEvent should only fire one time when crossing the threshold of 3. You may want to introduce new subscribers (e.g. a new subscriber called StockWarningSubscriber). In fact you may change anything as long as the task is performed and you can justify your reasonings. Remember subscribers should be notified in the order that the events occured.

    Your program should now allow you to create ISubscriber objects, register them using your IPublishSubscribService implementation. You can then create IEvent objects and call your IPublishSubscribService's implementations .publish() method. All handlers subscribed should have their 'handle' methods invoked.

    Note I: Handlers can also create new events, if desired. The events would get handled after all existing events are handled.

    Note II: If a subscriber subscribes after an event has already been published and consumed, they will not receive that event.

    You may make any changes to this codebase as long as you ultimately build a Pub-Sub application capable of handling the existing machine sale and refill events.

    Additional credit for using useful abstractions that add to the codebase. This is fairly general, and is here for you to demonstrate your knowledge. Some examples might be (i) using a repository for storing Machines and injecting them into events subscriber (ii) using advanced functional concepts like an Maybe (iii) and more
