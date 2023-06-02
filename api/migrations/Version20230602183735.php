<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230602183735 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE members_clan ADD rank_clan_id INT NOT NULL');
        $this->addSql('ALTER TABLE members_clan ADD CONSTRAINT FK_D09C83A99C23019A FOREIGN KEY (rank_clan_id) REFERENCES rank_clan (id)');
        $this->addSql('CREATE INDEX IDX_D09C83A99C23019A ON members_clan (rank_clan_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE members_clan DROP FOREIGN KEY FK_D09C83A99C23019A');
        $this->addSql('DROP INDEX IDX_D09C83A99C23019A ON members_clan');
        $this->addSql('ALTER TABLE members_clan DROP rank_clan_id');
    }
}
