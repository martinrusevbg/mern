CREATE TABLE `user_shares` (
       `id` int(11) NOT NULL,
       `createdAt` datetime NOT NULL,
       `updatedAt` datetime NOT NULL,
       `seen` tinyint(2) DEFAULT 0,
       `downloaded` tinyint(2) DEFAULT 0,
       `send` tinyint(2) DEFAULT 0,
       `fileId` int(11) NOT NULL,
       `clientId` int(11) NOT NULL,
       `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `user_shares`
    ADD PRIMARY KEY (`id`),
    ADD KEY `fileId` (`fileId`),
    ADD KEY `userId` (`userId`);

ALTER TABLE `user_shares`
    ADD CONSTRAINT `user_shares_ibfk_1` FOREIGN KEY (`fileId`) REFERENCES `files` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT `user_shares_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT `user_shares_ibfk_3` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `user_shares` CHANGE `id` `id` INT(11) NOT NULL AUTO_INCREMENT;

CREATE TABLE `clients` (
     `id` int(11) NOT NULL,
     `email` varchar(255) DEFAULT NULL,
     `country_code` varchar(255) DEFAULT NULL,
     `phone` varchar(255) DEFAULT NULL,
     `createdAt` datetime NOT NULL,
     `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `clients`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `clients`
    MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

ALTER TABLE `appdb`.`clients` ADD UNIQUE `email_phone` (`email`, `phone`);
