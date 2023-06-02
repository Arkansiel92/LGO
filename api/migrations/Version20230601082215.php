<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230601082215 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE challenge (id INT AUTO_INCREMENT NOT NULL, title_id INT DEFAULT NULL, description VARCHAR(255) NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_D7098951A9F87BD (title_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE challenge_role (challenge_id INT NOT NULL, role_id INT NOT NULL, INDEX IDX_5EC68DEC98A21AC6 (challenge_id), INDEX IDX_5EC68DECD60322AC (role_id), PRIMARY KEY(challenge_id, role_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE challenges_user (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, challenge_id INT DEFAULT NULL, type VARCHAR(255) NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_A40AEA0DA76ED395 (user_id), INDEX IDX_A40AEA0D98A21AC6 (challenge_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE challenge ADD CONSTRAINT FK_D7098951A9F87BD FOREIGN KEY (title_id) REFERENCES title (id)');
        $this->addSql('ALTER TABLE challenge_role ADD CONSTRAINT FK_5EC68DEC98A21AC6 FOREIGN KEY (challenge_id) REFERENCES challenge (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE challenge_role ADD CONSTRAINT FK_5EC68DECD60322AC FOREIGN KEY (role_id) REFERENCES role (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE challenges_user ADD CONSTRAINT FK_A40AEA0DA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE challenges_user ADD CONSTRAINT FK_A40AEA0D98A21AC6 FOREIGN KEY (challenge_id) REFERENCES challenge (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE challenge DROP FOREIGN KEY FK_D7098951A9F87BD');
        $this->addSql('ALTER TABLE challenge_role DROP FOREIGN KEY FK_5EC68DEC98A21AC6');
        $this->addSql('ALTER TABLE challenge_role DROP FOREIGN KEY FK_5EC68DECD60322AC');
        $this->addSql('ALTER TABLE challenges_user DROP FOREIGN KEY FK_A40AEA0DA76ED395');
        $this->addSql('ALTER TABLE challenges_user DROP FOREIGN KEY FK_A40AEA0D98A21AC6');
        $this->addSql('DROP TABLE challenge');
        $this->addSql('DROP TABLE challenge_role');
        $this->addSql('DROP TABLE challenges_user');
    }
}
