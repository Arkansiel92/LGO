<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ChallengesUserRepository;
use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ChallengesUserRepository::class)]
#[ApiResource]
class ChallengesUser
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['user:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'challengesUsers')]
    private ?User $user = null;

    #[ORM\ManyToOne]
    #[Groups(['user:read'])]
    private ?Challenge $challenge = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user:read'])]
    private ?string $type = null;

    #[ORM\Column(options:['default' => 0])]
    #[Groups(['user:read'])]
    private ?int $step = null;
    
    #[ORM\Column(options:['default' => false])]
    #[Groups(['user:read'])]
    private ?bool $isFinished = null;

    #[ORM\Column(options:['default' => 'CURRENT_TIMESTAMP'])]
    #[Groups(['user:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
        $this->step = 0;
        $this->isFinished = false;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getChallenge(): ?Challenge
    {
        return $this->challenge;
    }

    public function setChallenge(?Challenge $challenge): self
    {
        $this->challenge = $challenge;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }
    
    public function getStep(): ?int
    {
        return $this->step;
    }
    
    public function setStep(int $step): self
    {
        $this->step = $step;
        
        return $this;
    }
    
    public function isIsFinished(): ?bool
    {
        return $this->isFinished;
    }

    public function setIsFinished(bool $isFinished): self
    {
        $this->isFinished = $isFinished;
        
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }
}
