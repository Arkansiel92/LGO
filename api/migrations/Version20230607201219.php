<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230607201219 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE challenges_user CHANGE step step INT DEFAULT 0 NOT NULL, CHANGE is_finished is_finished TINYINT(1) DEFAULT 0 NOT NULL');
        $this->addSql('ALTER TABLE members_clan DROP INDEX IDX_D09C83A9A76ED395, ADD UNIQUE INDEX UNIQ_D09C83A9A76ED395 (user_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE challenges_user CHANGE step step INT NOT NULL, CHANGE is_finished is_finished TINYINT(1) NOT NULL');
        $this->addSql('ALTER TABLE members_clan DROP INDEX UNIQ_D09C83A9A76ED395, ADD INDEX IDX_D09C83A9A76ED395 (user_id)');
    }
}
