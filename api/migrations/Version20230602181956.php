<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230602181956 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE members_clan (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, clan_id INT NOT NULL, INDEX IDX_D09C83A9A76ED395 (user_id), INDEX IDX_D09C83A9BEAF84C8 (clan_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE members_clan ADD CONSTRAINT FK_D09C83A9A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE members_clan ADD CONSTRAINT FK_D09C83A9BEAF84C8 FOREIGN KEY (clan_id) REFERENCES clan (id)');
        $this->addSql('ALTER TABLE clan CHANGE level points INT DEFAULT 1 NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE members_clan DROP FOREIGN KEY FK_D09C83A9A76ED395');
        $this->addSql('ALTER TABLE members_clan DROP FOREIGN KEY FK_D09C83A9BEAF84C8');
        $this->addSql('DROP TABLE members_clan');
        $this->addSql('ALTER TABLE clan CHANGE points level INT DEFAULT 1 NOT NULL');
    }
}
