<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\RoleRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: RoleRepository::class)]
#[ApiResource]
class Role
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['user:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user:read'])]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    private ?string $name_function = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $description = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $side = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $step = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $descriptionInGame = null;

    #[ORM\Column]
    private ?int $max = null;

    #[ORM\Column]
    private ?bool $needVictim = null;

    #[ORM\Column(length: 255)]
    private ?string $img = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getNameFunction(): ?string
    {
        return $this->name_function;
    }

    public function setNameFunction(string $name_function): self
    {
        $this->name_function = $name_function;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getSide(): ?string
    {
        return $this->side;
    }

    public function setSide(string $side): self
    {
        $this->side = $side;

        return $this;
    }

    public function getStep(): ?string
    {
        return $this->step;
    }

    public function setStep(?string $step): self
    {
        $this->step = $step;

        return $this;
    }

    public function getDescriptionInGame(): ?string
    {
        return $this->descriptionInGame;
    }

    public function setDescriptionInGame(?string $descriptionInGame): self
    {
        $this->descriptionInGame = $descriptionInGame;

        return $this;
    }

    public function getMax(): ?int
    {
        return $this->max;
    }

    public function setMax(int $max): self
    {
        $this->max = $max;

        return $this;
    }

    public function isNeedVictim(): ?bool
    {
        return $this->needVictim;
    }

    public function setNeedVictim(bool $needVictim): self
    {
        $this->needVictim = $needVictim;

        return $this;
    }

    public function getImg(): ?string
    {
        return $this->img;
    }

    public function setImg(string $img): self
    {
        $this->img = $img;

        return $this;
    }
}
